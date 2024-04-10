import { TableRowSelection } from 'antd/lib/table'; // 假设 SearchTable 的类型与 Ant Design 的 Table 相似
import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import SearchTable, { SearchTableMethods, SearchTableProps } from 'src/SearchTable';
import useUpdateEffect from 'src/_utils/useUpdateEffect';

// 组件 props 的类型定义
export interface SelectableTableProps<T extends Record<string, any> = Record<string, any>>
  extends Omit<SearchTableProps<T>, 'onChange'> {
  value?: string[] | number[];
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => void;
}

export type SelectableTableMethods<T> = {} & SearchTableMethods<T>;

const SelectableTable = <T extends Record<string, any> = Record<string, any>>(
  { value, onChange, ...restProps }: SelectableTableProps<T>,
  ref: ForwardedRef<SelectableTableMethods<T>>,
) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>(() => value ?? []);
  const searchTableRef = useRef<SearchTableMethods<T>>(null);

  useUpdateEffect(() => {
    setSelectedRowKeys(value ?? []);
  }, [value]);

  const handleSelectChange: TableRowSelection<T>['onChange'] = (selectedKeys, selectedRows) => {
    setSelectedRowKeys(selectedKeys);
    onChange?.(selectedKeys, selectedRows);
  };

  const rowSelection: TableRowSelection<T> = {
    // 关闭 SearchTable 中的 selections 预设
    selections: undefined,
    selectedRowKeys,
    onChange: handleSelectChange,
  };

  const methods = {};

  // 使用 useImperativeHandle 来暴露组件方法
  useImperativeHandle(ref, () => ({
    ...methods,
    ...searchTableRef.current!,
  }));

  return <SearchTable ref={searchTableRef} {...restProps} rowSelection={rowSelection} />;
};

export default forwardRef(SelectableTable) as <T extends Record<string, any> = Record<string, any>>(
  props: SelectableTableProps<T> & { ref?: ForwardedRef<SelectableTableMethods<T>> },
) => JSX.Element;
