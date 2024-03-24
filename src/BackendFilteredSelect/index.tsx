import { Select, Spin } from 'antd';
import { OptionProps, SelectProps, SelectValue } from 'antd/es/select';
import debounce from 'lodash.debounce';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { highlightMatch } from '../_utils/highlightMatch';
import useUpdateEffect from '../_utils/useUpdateEffect';

export interface RequestParams<T> {
  searchText?: string;
  current: number;
  pageSize: number;
}

export interface RequestResult<T> {
  total: number;
  list: BackendFilteredSelectListItem[];
}

export type BackendFilteredSelectListItem = {
  [key: string]: any;
} & OptionProps;

export type BackendFilteredSelectProps<T = SelectValue> = {
  valueFieldName?: string;
  labelFieldName?: string;
  pageSize?: number;
  request?: (params: RequestParams<T>) => Promise<RequestResult<T>>;
} & SelectProps<T>;

export type BackendFilteredSelectMethods<T = SelectValue> = {};

// Add generic type T to the component function
const BackendFilteredSelect = forwardRef(
  <T extends SelectValue = SelectValue>(
    {
      valueFieldName = 'value',
      labelFieldName = 'label',
      pageSize = 10,
      request,
      ...selectProps
    }: BackendFilteredSelectProps<T>,
    ref: ForwardedRef<BackendFilteredSelectMethods<T>>,
  ) => {
    const [list, setList] = useState<BackendFilteredSelectListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState<string>();

    const skipNextFetchRef = useRef(false);
    const requestCounterRef = useRef(0); // 请求计数器

    const [hasMore, setHasMore] = useState(true);

    const currentPageRef = useRef(0);

    const listRef = useRef(list);

    useEffect(() => {
      listRef.current = list;
    }, [list]);

    // 保证这个函数内不使用外部的闭包，只使用 setState 和 ref，其他通过参数传入
    // 为了下面的 debounce 持久实例的正确调用
    const fetch = async (searchText: string, page: number) => {
      if (!request) return;
      const currentRequestIndex = ++requestCounterRef.current;
      try {
        setLoading(true);
        const { total, list: newList } = await request({ searchText, current: page, pageSize });

        if (currentRequestIndex === requestCounterRef.current) {
          setList((prev) => {
            // TODO: 如果请求的页数小于当前页面，应该更新切片数据，现在只做简单的第一页的处理
            // If it's a new search, reset list to the new one; otherwise, append.
            return page === 1 ? newList : prev.concat(newList);
          });
          /**
           * 这里不清空 list，但是重置了 current，根据它做判断
           */
          setHasMore(
            (currentPageRef.current === 0 ? 0 : listRef.current.length) + newList.length < total,
          );
          currentPageRef.current = page;
        }
      } finally {
        if (currentRequestIndex === requestCounterRef.current) {
          setLoading(false);
        }
      }
    };

    // 使用 useRef 来存储 debounce 函数的引用，以保证其在组件的每次渲染中保持不变
    const fetchRef = useRef(debounce(fetch, 350));

    // 不能这样更新，否则 debounce 就失效了（多个实例）
    // useEffect(() => {
    //   fetchRef.current = debounce(fetch, 350);
    // }, [fetch]);

    useUpdateEffect(() => {
      // 关闭弹窗的时候，不请求
      if (searchText !== undefined) {
        // 搜索后请求，就重置，比如下拉了几次后，重新输入了搜索参数
        setHasMore(true);
        fetchRef.current(searchText, 1);
      }
    }, [searchText]);

    // 在组件内部创建methods对象
    const methods: BackendFilteredSelectMethods<T> = {};

    // 更新useImperativeHandle钩子，直接使用methods对象
    useImperativeHandle(ref, () => methods);

    return (
      <Select
        {...(selectProps as SelectProps<SelectValue>)}
        allowClear
        showSearch
        showArrow
        filterOption={false} // 禁用本地过滤
        optionFilterProp="children"
        onSearch={(val) => {
          currentPageRef.current = 0;
          setSearchText(val);
          return;
        }}
        onDropdownVisibleChange={(visible) => {
          if (visible) {
            // 立即调用一次
            fetch('', 1);
          } else {
            setSearchText(undefined);
            currentPageRef.current = 0;
            setHasMore(true);
          }
        }}
        style={{
          width: '100%',
          ...selectProps.style,
        }}
        notFoundContent={null}
        dropdownRender={(menu, props) => {
          return (
            <div
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
                // 判断是否滚动到底部
                if (hasMore && scrollHeight - scrollTop === clientHeight) {
                  fetch(searchText ?? '', currentPageRef.current + 1);
                }
              }}
            >
              {currentPageRef.current > 0 && menu}
              {/* 添加自定义内容到下拉菜单底部 */}
              {loading && (
                <div style={{ padding: 8, textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              )}
              {!hasMore && currentPageRef.current > 1 && (
                <div style={{ padding: 8, textAlign: 'center' }}>没有更多了</div>
              )}
            </div>
          );
        }}
      >
        {list.map((item) => {
          return (
            <Select.Option {...item} key={item[valueFieldName]} value={item[valueFieldName]}>
              {highlightMatch(item[labelFieldName], searchText)}
            </Select.Option>
          );
        })}
      </Select>
    );
  },
);

export default BackendFilteredSelect;
