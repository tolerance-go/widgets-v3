import { Table } from 'antd';
import { TableProps } from 'antd/es/table';
import { TableRowSelection } from 'antd/lib/table'; // 假设 SearchTable 的类型与 Ant Design 的 Table 相似
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { TableSelectionBar } from 'src/_utils/TableSelectionBar';
import { handleError } from 'src/_utils/handleError';
import useLatestRef from 'src/_utils/useLatestRef';
import useUpdateEffect from 'src/_utils/useUpdateEffect';

// 组件 props 的类型定义
export interface SelectableTableProps<T extends Record<string, any> = Record<string, any>>
  extends Omit<TableProps<T>, 'onChange'> {
  value?: string[] | number[];
  params?: Record<string, any>;
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => void;
  request?: (args: { params?: Record<string, any> }) => Promise<T[]>;
  renderBatchActionGroup?: (args: {
    methods: SelectableTableMethods<T>;
    selectedRowKeys: string[] | number[];
  }) => React.ReactNode;
  renderSelectionDetail?: (args: {
    methods: SelectableTableMethods<T>;
    selectedRowKeys: string[] | number[];
  }) => React.ReactNode;
}

export type SelectableTableMethods<T extends Record<string, any> = Record<string, any>> = {
  clearSelection: () => void;
  getDataSource: () => T[];
  getSelectedRows: () => T[];
};

const SelectableTable = <T extends Record<string, any> = Record<string, any>>(
  {
    value,
    onChange,
    request,
    renderSelectionDetail,
    renderBatchActionGroup,
    rowKey = 'key',
    params,
    rowSelection: propRowSelection,
    ...restProps
  }: SelectableTableProps<T>,
  ref: ForwardedRef<SelectableTableMethods<T>>,
) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>(() => value ?? []);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T[]>([]);

  const handleSelectChange: TableRowSelection<T>['onChange'] = (selectedKeys, selectedRows) => {
    setSelectedRowKeys(selectedKeys);
    onChange?.(selectedKeys, selectedRows);
  };

  const rowSelection: TableRowSelection<T> = {
    ...propRowSelection,
    selectedRowKeys,
    onChange: handleSelectChange,
  };

  const clearSelection = () => {
    setSelectedRowKeys([]);
    onChange?.([], []);
  };

  const getDataSource = () => {
    return list;
  };

  const getSelectedRows = () => {
    return list.filter((item, index) =>
      (selectedRowKeys as (string | number)[]).includes(
        typeof rowKey === 'function' ? rowKey(item, index) : item[rowKey],
      ),
    );
  };

  const methods: SelectableTableMethods<T> = {
    clearSelection,
    getDataSource,
    getSelectedRows,
  };

  // 使用 useImperativeHandle 来暴露组件方法
  useImperativeHandle(ref, () => methods);

  const fetch = async (params?: Record<string, any>) => {
    try {
      if (!request) return;
      setLoading(true);
      const list = await request({ params });
      setList(list);
    } catch (error) {
      handleError(error, '请求表格数据异常');
    } finally {
      setLoading(false);
    }
  };

  const fetchRef = useLatestRef(fetch);

  useUpdateEffect(() => {
    setSelectedRowKeys(value ?? []);
  }, [value]);

  useEffect(() => {
    fetchRef.current(params);
  }, []);

  useUpdateEffect(() => {
    fetchRef.current(params);
  }, [JSON.stringify(params)]);

  return (
    <div>
      <TableSelectionBar
        selectedRowKeys={selectedRowKeys}
        clearSelection={clearSelection}
        selectionDetail={renderSelectionDetail?.({
          methods,
          selectedRowKeys,
        })}
        batchActionGroup={renderBatchActionGroup?.({
          methods,
          selectedRowKeys,
        })}
      />
      <Table
        {...restProps}
        rowKey={rowKey}
        dataSource={list}
        loading={loading}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default forwardRef(SelectableTable) as <T extends Record<string, any> = Record<string, any>>(
  props: SelectableTableProps<T> & { ref?: ForwardedRef<SelectableTableMethods<T>> },
) => JSX.Element;
