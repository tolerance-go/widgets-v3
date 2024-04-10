import { Alert, Button, Col, Row, Table, Tabs } from 'antd';
import {
  ColumnProps,
  PaginationConfig,
  SortOrder,
  SorterResult,
  TableCurrentDataSource,
  TableEventListeners,
  TableProps,
  TableStateFilters,
} from 'antd/es/table';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import SearchForm, { SearchFormProps } from '../SearchForm';
import { handleError } from 'src/_utils/handleError';
import useLatestRef from 'src/_utils/useLatestRef';

const { TabPane } = Tabs;

export interface RequestParams<T> {
  activeTabKey?: string;
  tabItem?: TableTabItem;
  pagination: PaginationConfig;
  filters: Partial<Record<keyof T, string[]>>;
  sorter: Record<string, any>;
  search: Record<string, any>;
  extra: TableCurrentDataSource<T>;
  methods: SearchTableMethods<T>;
}

export interface RequestResult<T> {
  list: T[];
  total: number;
  data?: Record<string, any>;
}

type TableTabItem = {
  key?: string;
  title?: string;
  data?: Record<string, any>;
};

type TableSelectionState<T> = {
  selectedRowKeys: string[] | number[];
  selectedRows: T[];
};

type SearchTableColumnProps<T> = Omit<
  ColumnProps<T>,
  'title' | 'children' | 'onHeaderCell' | 'render'
> & {
  title?:
    | React.ReactNode
    | ((options: {
        filters: TableStateFilters;
        sortOrder?: SortOrder;
        sortColumn?: SearchTableColumnProps<T> | null;
      }) => React.ReactNode);
  children?: SearchTableColumnProps<T>[];
  onHeaderCell?: (props: SearchTableColumnProps<T>) => TableEventListeners;
  render?: (
    text: any,
    record: T,
    index: number,
    args: {
      data: Record<string, any>;
    },
  ) => React.ReactNode;
};

export type SearchTableProps<T extends {} = {}> = {
  tabs?: TableTabItem[];
  headerTitle?: string;
  searchForm?: SearchFormProps | ((params: { activeTabKey?: string }) => SearchFormProps);
  request?: (params: RequestParams<T>) => Promise<RequestResult<T>>;
  renderActionGroup?: (args: {
    methods: SearchTableMethods<T>;
    activeTabKey?: string;
    selectedRowsInfo: TableSelectionState<T>;
  }) => React.ReactNode;
  renderBatchActionGroup?: (args: {
    methods: SearchTableMethods<T>;
    activeTabKey?: string;
    selectedRowsInfo: TableSelectionState<T>;
  }) => React.ReactNode;
  renderSelectionDetail?: (args: {
    methods: SearchTableMethods<T>;
    activeTabKey?: string;
    selectedRowsInfo: TableSelectionState<T>;
  }) => React.ReactNode;
  columns?:
    | SearchTableColumnProps<T>[]
    | ((args: {
        methods: SearchTableMethods<T>;
        activeTabKey?: string;
        selectedRowsInfo: TableSelectionState<T>;
      }) => SearchTableColumnProps<T>[]);
} & Omit<TableProps<T>, 'columns'>;

export type SearchTableMethods<T> = {
  reload: (params?: Partial<RequestParams<T>>) => void;
  clearSelection: () => void;
  getTabItem: (key: string) => TableTabItem | undefined;
};

// Add generic type T to the component function
const SearchTable = forwardRef(
  <T extends Record<string, any> = Record<string, any>>(
    {
      searchForm,
      tabs,
      headerTitle,
      request,
      renderActionGroup,
      renderBatchActionGroup,
      renderSelectionDetail,
      rowKey = 'key',
      columns,
      ...tableProps
    }: SearchTableProps<T>,
    ref: ForwardedRef<SearchTableMethods<T>>,
  ) => {
    const [list, setList] = useState<T[]>([]);
    const [data, setData] = useState<Record<string, any>>({});
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
      extra: { currentDataSource: list },
      searchValues: {},
    });

    // 保存选中行的keys和rows
    const [selectedRowsInfo, setSelectedRowsInfo] = useState<TableSelectionState<T>>({
      selectedRowKeys: [],
      selectedRows: [],
    });

    const skipNextFetchRef = useRef(false);

    const clearSelection = () => {
      setSelectedRowsInfo({
        selectedRowKeys: [],
        selectedRows: [],
      });
    };

    const fetch = async (params: RequestParams<T>) => {
      if (!request) return;

      try {
        setLoading(true);
        const result = await request(params);
        setList(result.list); // TypeScript now knows this is T[]
        result.data && setData(result.data);
        clearSelection();
        setTableState((prevState) => ({
          ...prevState,
          pagination: { ...prevState.pagination, total: result.total },
        }));
      } catch (error) {
        handleError(error, '请求表格数据失败');
      } finally {
        setLoading(false);
      }
    };

    const fetchRef = useRef(fetch);

    useEffect(() => {
      fetchRef.current = fetch;
    }, [fetch]);

    // 在组件内部创建methods对象
    const methods: SearchTableMethods<T> = {
      clearSelection,
      reload: (params?: Partial<RequestParams<T>>) => {
        const nextParams = {
          tabItem: tableState.activeTabKey
            ? methodsRef.current.getTabItem(tableState.activeTabKey)
            : undefined,
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
          methods,
        };

        fetch(nextParams);

        skipNextFetchRef.current = true;
        setTableState({
          ...tableState,
          ...nextParams,
        });
      },
      getTabItem: (key: string) => {
        return tabs?.find((item) => item.key === key);
      },
    };

    // 更新useImperativeHandle钩子，直接使用methods对象
    useImperativeHandle(ref, () => methods);

    const methodsRef = useLatestRef(methods);

    useEffect(() => {
      if (skipNextFetchRef.current) {
        skipNextFetchRef.current = false;
        return;
      }

      fetchRef.current({
        tabItem: tableState.activeTabKey
          ? methodsRef.current.getTabItem(tableState.activeTabKey)
          : undefined,
        activeTabKey: tableState.activeTabKey,
        pagination: tableState.pagination,
        filters: tableState.filters,
        sorter: tableState.sorter,
        search: tableState.searchValues,
        extra: tableState.extra,
        methods: methodsRef.current,
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

    // 处理rowSelection，合并用户的配置
    const handleRowSelection: TableProps<T>['rowSelection'] = tableProps.rowSelection
      ? {
          // 在selections中添加自定义选择项来实现反选
          selections: [
            {
              key: 'invert',
              text: '反选当页',
              onSelect: (changableRowKeys) => {
                const nextSelectedRowKeys = changableRowKeys.filter((key) => {
                  // selectedRowKeys 可能为 number 数组或 string 数组
                  return !(selectedRowsInfo.selectedRowKeys as string[]).includes(key);
                });
                // 需要找到这些键对应的行数据
                const nextSelectedRows = list.filter(
                  (row, index) =>
                    nextSelectedRowKeys.includes(
                      row[typeof rowKey === 'function' ? rowKey(row, index) : rowKey],
                    ), // 假设每行数据都有一个唯一的`key`属性
                );
                setSelectedRowsInfo({
                  selectedRowKeys: nextSelectedRowKeys,
                  selectedRows: nextSelectedRows,
                });
              },
            },
          ],
          ...tableProps.rowSelection,
          hideDefaultSelections: true,
          onChange: (selectedRowKeys, selectedRows) => {
            // 更新内部状态
            setSelectedRowsInfo({ selectedRowKeys, selectedRows });

            // 如果用户传递了onChange，则调用
            tableProps.rowSelection?.onChange?.(selectedRowKeys, selectedRows);
          },
          selectedRowKeys: selectedRowsInfo.selectedRowKeys,
        }
      : undefined;

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

    const mergedColumns = useMemo(() => {
      if (typeof columns === 'function') {
        return columns({
          activeTabKey: tableState.activeTabKey,
          methods,
          selectedRowsInfo,
        });
      }
      return columns;
    }, [columns, tableState.activeTabKey, methods, selectedRowsInfo]);

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
          style={{
            marginBottom: 10,
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
                onChange={(key) =>
                  setTableState((prev) => ({
                    ...prev,
                    pagination: { ...prev.pagination, current: 1 },
                    activeTabKey: key,
                  }))
                }
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
                renderActionGroup?.({
                  methods,
                  activeTabKey: tableState.activeTabKey,
                  selectedRowsInfo,
                }),
                (action: React.ReactNode, index: number) => (
                  <Col key={index}>{action}</Col>
                ),
              )}
            </Row>
          </Col>
        </Row>
        {!!selectedRowsInfo.selectedRowKeys.length && (
          <Alert
            style={{ marginBottom: 16 }}
            message={
              <Row type="flex" gutter={10} align="middle" justify="space-between">
                <Col>
                  <Row type="flex" align="middle" gutter={8}>
                    <Col>
                      <span>
                        <span>已选 {selectedRowsInfo.selectedRowKeys.length} 项</span>
                        <Button
                          style={{
                            marginLeft: 8,
                          }}
                          size="small"
                          type="link"
                          onClick={clearSelection}
                        >
                          取消选择
                        </Button>
                      </span>
                    </Col>
                    <Col>
                      {renderSelectionDetail?.({
                        methods,
                        activeTabKey: tableState.activeTabKey,
                        selectedRowsInfo,
                      })}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row align="middle" type="flex" gutter={8}>
                    {React.Children.map(
                      renderBatchActionGroup?.({
                        methods,
                        activeTabKey: tableState.activeTabKey,
                        selectedRowsInfo,
                      }),
                      (action: React.ReactNode, index: number) => (
                        <Col key={index}>{action}</Col>
                      ),
                    )}
                  </Row>
                </Col>
              </Row>
            }
          ></Alert>
        )}
        <Table
          {...tableProps}
          columns={mergedColumns?.map((col) => {
            return {
              ...col,
              render: col.render
                ? (text, record, index) => {
                    return col.render!(text, record, index, { data });
                  }
                : undefined,
            } as ColumnProps<T>;
          })}
          rowKey={rowKey}
          // 应用处理过的rowSelection
          rowSelection={handleRowSelection}
          dataSource={list}
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
