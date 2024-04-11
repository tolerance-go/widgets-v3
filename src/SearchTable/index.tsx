import { Affix, Alert, Button, Col, Pagination, Row, Spin, Table, Tabs } from 'antd';
import ReactDOM from 'react-dom';
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
import './index.less';
import { classNames } from 'src/_utils/classNames';
import { TableSelectionBar } from 'src/_utils/TableSelectionBar';
import { AffixProps } from 'antd/es/affix';

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
  floatingPagination?: boolean;
  getPaginationContainer?: () => HTMLElement; // 函数，返回分页器的容器DOM元素
} & Omit<TableProps<T>, 'columns'>;

const FloatingPagination = <T extends {} = {}>({
  paginationProps,
  onChange,
  loading,
  getPaginationContainer,
}: {
  onChange?: (page: number, pageSize?: number) => void;
  paginationProps: TableProps<T>['pagination'];
  loading?: boolean;
  getPaginationContainer?: () => HTMLElement; // 函数，返回分页器的容器DOM元素
}) => {
  // 使用 getPaginationContainer 函数获取容器
  const container = getPaginationContainer ? getPaginationContainer() : document.body;

  return ReactDOM.createPortal(
    <Spin spinning={loading} indicator={<span></span>}>
      <Row
        style={{
          padding: '16px 0px',
          background: 'white',
        }}
        type="flex"
        justify="space-between"
        align="middle"
      >
        <Col></Col>
        <Col>
          <Pagination {...paginationProps} onChange={onChange} onShowSizeChange={onChange} />
        </Col>
      </Row>
    </Spin>,
    container,
  );
};

export type SearchTableMethods<T> = {
  reload: (params?: Partial<RequestParams<T>>) => void;
  clearSelection: () => void;
  getTabItem: (key: string) => TableTabItem | undefined;
};

type TableState<T> = {
  activeTabKey: string | undefined;
  pagination: Pick<PaginationConfig, 'current' | 'total' | 'pageSize'>;
  filters: Partial<Record<keyof T, string[]>>;
  sorter: Record<string, any>;
  extra: TableCurrentDataSource<T>;
  searchValues: Record<string, any>;
};

// Add generic type T to the component function
const SearchTable = <T extends Record<string, any> = Record<string, any>>(
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
    floatingPagination,
    getPaginationContainer,
    ...tableProps
  }: SearchTableProps<T>,
  ref: ForwardedRef<SearchTableMethods<T>>,
) => {
  const [list, setList] = useState<T[]>([]);
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const [tableState, setTableState] = useState<TableState<T>>({
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
      const nextTableState: TableState<T> = {
        activeTabKey: params?.activeTabKey ?? tableState.activeTabKey,
        pagination: params?.pagination
          ? { ...tableState.pagination, ...params?.pagination }
          : tableState.pagination,
        filters: params?.filters
          ? { ...tableState.filters, ...params?.filters }
          : tableState.filters,
        sorter: params?.sorter ? { ...tableState.sorter, ...params?.sorter } : tableState.sorter,
        searchValues: params?.search
          ? { ...tableState.searchValues, ...params?.search }
          : tableState.searchValues,
        extra: params?.extra ? { ...tableState.extra, ...params?.extra } : tableState.extra,
      };

      const { searchValues, ...restTableState } = nextTableState;

      fetch({
        tabItem: tableState.activeTabKey
          ? methodsRef.current.getTabItem(tableState.activeTabKey)
          : undefined,
        methods,
        search: nextTableState.searchValues,
        ...restTableState,
      });

      /**
       * 判断一下触发自动请求的参数列表是否产生 diff，如果有 diff 的情况下，才禁止下次自动请求，否则跳过不去影响下次正常请求
       */
      if (
        !(
          tableState.pagination.current === nextTableState.pagination.current &&
          tableState.pagination.pageSize === nextTableState.pagination.pageSize &&
          tableState.filters === nextTableState.filters &&
          tableState.sorter === nextTableState.sorter &&
          tableState.extra === nextTableState.extra &&
          tableState.searchValues === nextTableState.searchValues &&
          tableState.activeTabKey === nextTableState.activeTabKey
        )
      ) {
        // 禁止下一次自动请求
        skipNextFetchRef.current = true;
      }

      setTableState(nextTableState);
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
        hideDefaultSelections: true,
        selectedRowKeys: selectedRowsInfo.selectedRowKeys,
        ...tableProps.rowSelection,
        onChange: (selectedRowKeys, selectedRows) => {
          // 更新内部状态
          setSelectedRowsInfo({ selectedRowKeys, selectedRows });

          // 如果用户传递了onChange，则调用
          tableProps.rowSelection?.onChange?.(selectedRowKeys, selectedRows);
        },
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

  const headerTitleEl = headerTitle && (
    <span
      style={{
        color: 'rgba(42, 46, 54, 0.88)',
        fontWeight: 500,
        fontSize: '16px',
      }}
    >
      {headerTitle}
    </span>
  );

  const tabsEl = tabs?.length && (
    <Tabs
      className="wg-search-table-tabs"
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
        return <TabPane tab={item.title} key={item.key} disabled={loading}></TabPane>;
      })}
    </Tabs>
  );

  const actionGroupEl = renderActionGroup && (
    <Row type="flex" gutter={8}>
      {React.Children.map(
        renderActionGroup({
          methods,
          activeTabKey: tableState.activeTabKey,
          selectedRowsInfo,
        }),
        (action: React.ReactNode, index: number) => (
          <Col key={index}>{action}</Col>
        ),
      )}
    </Row>
  );

  const paginationProps: TableProps<T>['pagination'] = {
    ...tableState.pagination,
    // 通常我们希望对结果进行向上取整，确保所有记录都可以被展示，即使最后一页的记录数不足一页的容量。
    showTotal: (total, range) =>
      `共 ${total} 条记录 第 ${tableState.pagination.current} / ${Math.ceil(
        total / (tableState.pagination.pageSize ?? 1),
      )} 页`,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
    showQuickJumper: true,
  };

  return (
    <div className="wg-search-table-wrapper">
      {searchForm && (
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
      )}
      {(headerTitleEl || tabsEl || actionGroupEl) && (
        <Row
          style={{ paddingTop: 16, paddingBottom: 16 }}
          type="flex"
          justify="space-between"
          align="middle"
        >
          <Col>
            {headerTitleEl}
            {tabsEl}
          </Col>
          <Col>{actionGroupEl}</Col>
        </Row>
      )}
      <TableSelectionBar
        selectedRowKeys={selectedRowsInfo.selectedRowKeys}
        clearSelection={clearSelection}
        selectionDetail={renderSelectionDetail?.({
          methods,
          activeTabKey: tableState.activeTabKey,
          selectedRowsInfo,
        })}
        batchActionGroup={renderBatchActionGroup?.({
          methods,
          activeTabKey: tableState.activeTabKey,
          selectedRowsInfo,
        })}
      />
      <Table
        {...tableProps}
        className={classNames(
          'wg-search-table',
          tableProps.className,
          floatingPagination && 'hidden-pagination',
        )}
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
        pagination={paginationProps}
        loading={loading}
        onChange={handleTableChange}
      />
      {floatingPagination && (
        <FloatingPagination
          loading={loading}
          getPaginationContainer={getPaginationContainer}
          paginationProps={paginationProps}
          onChange={(current, pageSize) => {
            setTableState((prevState) => ({
              ...prevState,
              pagination: {
                ...prevState.pagination,
                current,
                pageSize,
              },
            }));
          }}
        />
      )}
    </div>
  );
};

export default forwardRef(SearchTable) as <T extends Record<string, any> = Record<string, any>>(
  props: SearchTableProps<T> & { ref?: ForwardedRef<SearchTableMethods<T>> },
) => JSX.Element;
