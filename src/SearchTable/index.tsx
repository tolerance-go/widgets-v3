import { Col, Row, Table, Tabs } from 'antd';
import { PaginationConfig, SorterResult, TableCurrentDataSource, TableProps } from 'antd/lib/table';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import SearchForm, { SearchFormProps } from '../SearchForm';

const { TabPane } = Tabs;

export interface RequestParams<T> {
  activeTabKey?: string;
  pagination: PaginationConfig;
  filters: Partial<Record<keyof T, string[]>>;
  sorter: Record<string, any>;
  search: Record<string, any>;
  extra: TableCurrentDataSource<T>;
}

export interface RequestResult<T> {
  data: T[];
  total: number;
}

type TableTabItem = {
  key?: string;
  title?: string;
};

export type SearchTableProps<T extends {} = {}> = {
  tabs?: TableTabItem[];
  headerTitle?: string;
  searchForm?: SearchFormProps | ((params: { activeTabKey?: string }) => SearchFormProps);
  request?: (params: RequestParams<T>) => Promise<RequestResult<T>>;
  renderActionGroup?: (args: {
    methods: SearchTableMethods<T>;
    activeTabKey?: string;
  }) => React.ReactNode;
} & TableProps<T>;

export type SearchTableMethods<T> = {
  reload: (params?: Partial<RequestParams<T>>) => void;
};

// Add generic type T to the component function
const SearchTable = forwardRef(
  <T extends {} = {}>(
    {
      searchForm,
      tabs,
      headerTitle,
      request,
      renderActionGroup,
      ...tableProps
    }: SearchTableProps<T>,
    ref: ForwardedRef<SearchTableMethods<T>>,
  ) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);

    const [tableState, setTableState] = useState<{
      activeTabKey: string | undefined;
      pagination: PaginationConfig;
      filters: Partial<Record<keyof T, string[]>>;
      sorter: Record<string, any>;
      extra: TableCurrentDataSource<T>;
      searchValues: Record<string, any>;
    }>({
      activeTabKey: tabs?.[0]?.key,
      pagination: { current: 1, pageSize: 10 },
      filters: {},
      sorter: {},
      extra: { currentDataSource: data },
      searchValues: {},
    });

    const skipNextFetchRef = useRef(false);

    const fetch = async (params: RequestParams<T>) => {
      if (!request) return;

      setLoading(true);
      const result = await request(params);
      setData(result.data); // TypeScript now knows this is T[]
      setTableState((prevState) => ({
        ...prevState,
        pagination: { ...prevState.pagination, total: result.total },
      }));
      setLoading(false);
    };

    // 在组件内部创建methods对象
    const methods: SearchTableMethods<T> = {
      reload: (params?: Partial<RequestParams<T>>) => {
        const nextParams = {
          activeTabKey: params?.activeTabKey,
          pagination: params?.pagination
            ? { ...tableState.pagination, ...params?.pagination }
            : tableState.pagination,
          filters: params?.filters
            ? { ...tableState.filters, ...params?.filters }
            : tableState.filters,
          sorter: params?.sorter ? { ...tableState.sorter, ...params?.sorter } : tableState.sorter,
          search: params?.search
            ? { ...tableState.searchValues, ...params?.search }
            : tableState.searchValues,
          extra: params?.extra ? { ...tableState.extra, ...params?.extra } : tableState.extra,
        };

        fetch(nextParams);

        skipNextFetchRef.current = true;
        setTableState({
          ...tableState,
          ...nextParams,
        });
      },
    };

    // 更新useImperativeHandle钩子，直接使用methods对象
    useImperativeHandle(ref, () => methods);

    useEffect(() => {
      if (skipNextFetchRef.current) {
        skipNextFetchRef.current = false;
        return;
      }

      fetch({
        activeTabKey: tableState.activeTabKey,
        pagination: tableState.pagination,
        filters: tableState.filters,
        sorter: tableState.sorter,
        search: tableState.searchValues,
        extra: tableState.extra,
      });
    }, [
      tableState.pagination.current,
      tableState.pagination.pageSize,
      tableState.filters,
      tableState.sorter,
      tableState.extra,
      tableState.searchValues,
      tableState.activeTabKey,
    ]);

    const handleTableChange: TableProps<T>['onChange'] = (
      pagination: PaginationConfig,
      filters: Partial<Record<keyof T, string[]>>,
      sorter: SorterResult<T>,
      extra: TableCurrentDataSource<T>,
    ) => {
      setTableState((prevState) => ({
        ...prevState,
        pagination,
        filters,
        sorter,
        extra,
      }));
    };

    return (
      <div>
        <SearchForm
          {...(typeof searchForm === 'function'
            ? searchForm({ activeTabKey: tableState.activeTabKey })
            : searchForm)}
          onSearch={(values) => {
            setTableState((prev) => ({
              ...prev,
              pagination: { ...prev.pagination, current: 1 },
              searchValues: values,
            }));
          }}
        ></SearchForm>
        <Row
          style={{ paddingTop: 16, paddingBottom: 16 }}
          type="flex"
          justify="space-between"
          align="middle"
        >
          <Col>
            {headerTitle && (
              <span
                style={{
                  color: 'rgba(42, 46, 54, 0.88)',
                  fontWeight: 500,
                  fontSize: '16px',
                }}
              >
                {headerTitle}
              </span>
            )}
            {tabs?.length && (
              <Tabs
                activeKey={tableState.activeTabKey}
                type="card"
                onChange={(key) => setTableState((prev) => ({ ...prev, activeTabKey: key }))}
              >
                {tabs.map((item) => {
                  return <TabPane tab={item.title} key={item.key}></TabPane>;
                })}
              </Tabs>
            )}
          </Col>
          <Col>
            <Row type="flex" gutter={8}>
              {React.Children.map(
                renderActionGroup?.({ methods, activeTabKey: tableState.activeTabKey }),
                (action: React.ReactNode, index: number) => (
                  <Col key={index}>{action}</Col>
                ),
              )}
            </Row>
          </Col>
        </Row>
        <Table
          {...tableProps}
          dataSource={data}
          pagination={{
            ...tableState.pagination,
            // 通常我们希望对结果进行向上取整，确保所有记录都可以被展示，即使最后一页的记录数不足一页的容量。
            showTotal: (total, range) =>
              `共 ${total} 条记录 第 ${tableState.pagination.current} / ${Math.ceil(
                total / (tableState.pagination.pageSize ?? 1),
              )} 页`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
            showQuickJumper: true,
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
    );
  },
);

export default SearchTable;
