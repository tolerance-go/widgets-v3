import { Select, Spin } from 'antd';
import { OptionProps, SelectProps, SelectValue } from 'antd/lib/select';
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

    const currentPageRef = useRef(1);

    const fetch = async (searchText: string, page: number = 1) => {
      if (!request) return;
      const currentRequestIndex = ++requestCounterRef.current;
      try {
        setLoading(true);
        const { total, list: newList } = await request({ searchText, current: page, pageSize });

        if (currentRequestIndex === requestCounterRef.current) {
          setList((prev) => {
            // If it's a new search, reset list to the new one; otherwise, append.
            return page === 1 ? newList : prev.concat(newList);
          });
          setHasMore(list.length + newList.length < total);
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

    useEffect(() => {
      fetchRef.current = debounce(fetch, 350);
    }, [fetch]);

    useUpdateEffect(() => {
      // 关闭弹窗的时候，不请求
      if (searchText !== undefined) {
        // 搜索后请求，就重置，比如下拉了几次后，重新输入了搜索参数
        setList([]);
        setHasMore(true);
        fetchRef.current(searchText);
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
          setSearchText(val);
          return;
        }}
        onDropdownVisibleChange={(visible) => {
          if (visible) {
            // 立即调用一次
            fetch('');
          } else {
            setSearchText(undefined);
            currentPageRef.current = 1;
            setList([]);
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
              {menu}
              {/* 添加自定义内容到下拉菜单底部 */}
              {loading && (
                <div style={{ padding: 8, textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              )}
              {!hasMore && <div style={{ padding: 8, textAlign: 'center' }}>没有更多了</div>}
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
