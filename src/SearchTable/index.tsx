import React, { useState, useEffect } from 'react';
import SearchForm, { SearchFormProps } from '../SearchForm';
import { Table } from 'antd';
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
  searchForm?: SearchFormProps;
  request?: (params: RequestParams<T>) => Promise<RequestResult<T>>;
} & TableProps<T>;

// Add generic type T to the component function
const SearchTable = <T extends {} = {}>({
  searchForm,
  request,
  ...tableProps
}: SearchTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<Partial<Record<keyof T, string[]>>>({});
  const [sorter, setSorter] = useState<Record<string, any>>({});
  const [extra, setExtra] = useState<TableCurrentDataSource<T>>({
    currentDataSource: data,
  });
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, any>>({});

  const fetch = async (params: RequestParams<T>) => {
    if (!request) return;

    setLoading(true);
    const result = await request(params);
    setData(result.data); // TypeScript now knows this is T[]
    setPagination({ ...pagination, total: result.total });
    setLoading(false);
  };

  useEffect(() => {
    fetch({ pagination, filters, sorter, search: searchValues, extra });
  }, [pagination.current, pagination.pageSize, filters, sorter, extra, searchValues]);

  const handleTableChange: TableProps<T>['onChange'] = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof T, string[]>>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>,
  ) => {
    setPagination(pagination);
    setFilters(filters);
    setSorter(sorter);
    setExtra(extra);
  };

  return (
    <div>
      <SearchForm
        {...searchForm}
        onSearch={(values) => {
          setPagination((prev) => ({ ...prev, current: 1 }));
          setSearchValues(values);
        }}
      ></SearchForm>
      <Table
        {...tableProps}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default SearchTable;
