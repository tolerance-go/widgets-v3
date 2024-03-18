import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  ForwardedRef,
  useRef,
} from 'react';
import SearchForm, { SearchFormProps } from '../SearchForm';
import { Col, Row, Table, Typography } from 'antd';
import { TableProps, PaginationConfig } from 'antd/lib/table';
import { SorterResult, TableCurrentDataSource } from 'antd/lib/table';

export interface RequestParams<T> {
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

export type SearchTableProps<T extends {} = {}> = {
  headerTitle?: string;
  searchForm?: SearchFormProps;
  request?: (params: RequestParams<T>) => Promise<RequestResult<T>>;
  renderActionGroup?: (args: { methods: SearchTableMethods<T> }) => React.ReactNode;
} & TableProps<T>;

export type SearchTableMethods<T> = {
  reload: (params?: Partial<RequestParams<T>>) => void;
};

// Add generic type T to the component function
const SearchTable = forwardRef(
  <T extends {} = {}>(
    { searchForm, headerTitle, request, renderActionGroup, ...tableProps }: SearchTableProps<T>,
    ref: ForwardedRef<SearchTableMethods<T>>,
  ) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);

    const [tableState, setTableState] = useState<{
      pagination: PaginationConfig;
      filters: Partial<Record<keyof T, string[]>>;
      sorter: Record<string, any>;
      extra: TableCurrentDataSource<T>;
      searchValues: Record<string, any>;
    }>({
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
          {...searchForm}
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
          </Col>
          <Col>
            <Row type="flex" gutter={8}>
              {React.Children.map(
                renderActionGroup?.({ methods }),
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
