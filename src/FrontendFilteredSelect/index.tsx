import { Select, Spin, message } from 'antd';
import { OptionProps, SelectProps, SelectValue } from 'antd/lib/select';
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

// 扩展 OptionProps 来包含自定义的 data-filter 属性
interface ExtendedOptionProps extends OptionProps {
  'data-filter'?: string; // 添加可选的 data-filter 属性
}

export interface RequestParams<T> {}

export type RequestResult<T> = FrontendFilteredSelectListItem[];

export type FrontendFilteredSelectListItem = {
  [key: string]: any;
} & ExtendedOptionProps; // 使用扩展后的接口

export type FrontendFilteredSelectProps<T = SelectValue> = {
  initialList?: FrontendFilteredSelectListItem[];
  valueFieldName?: string;
  labelFieldName?: string;
  filterFieldName?: string;
  request?: () => Promise<RequestResult<T>>;
} & SelectProps<T>;

export type FrontendFilteredSelectMethods<T = SelectValue> = {};

// Add generic type T to the component function
const FrontendFilteredSelect = forwardRef(
  <T extends SelectValue = SelectValue>(
    {
      initialList = [],
      valueFieldName = 'value',
      labelFieldName = 'label',
      filterFieldName = labelFieldName,
      request,
      ...selectProps
    }: FrontendFilteredSelectProps<T>,
    ref: ForwardedRef<FrontendFilteredSelectMethods<T>>,
  ) => {
    const [list, setList] = useState<FrontendFilteredSelectListItem[]>(initialList);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState<string>();

    const requestCounterRef = useRef(0); // 请求计数器

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const loadList = async () => {
      if (!request) return;
      const currentRequestIndex = ++requestCounterRef.current;
      try {
        setLoading(true);
        const newList = await request();

        if (currentRequestIndex === requestCounterRef.current) {
          setList(newList);
        }
      } catch (error) {
        let errorMessage;

        // 判断错误的类型
        if (typeof error === 'string') {
          // 如果错误是一个字符串
          errorMessage = error;
        } else if (error instanceof Error) {
          // 如果错误是Error对象
          errorMessage = error.message;
        }

        console.log(error);
        message.error(errorMessage || '请求下拉选项异常');
      } finally {
        if (currentRequestIndex === requestCounterRef.current) {
          setLoading(false);
        }
      }
    };

    // 使用 useRef 来存储 debounce 函数的引用，以保证其在组件的每次渲染中保持不变
    const fetchRef = useRef(loadList);

    useEffect(() => {
      fetchRef.current = loadList;
    }, [loadList]);

    useUpdateEffect(() => {
      // 关闭弹窗的时候，不请求
      if (dropdownVisible) {
        fetchRef.current();
      }
    }, [dropdownVisible]);

    // 在组件内部创建methods对象
    const methods: FrontendFilteredSelectMethods<T> = {};

    // 更新useImperativeHandle钩子，直接使用methods对象
    useImperativeHandle(ref, () => methods);

    return (
      <Select
        {...(selectProps as SelectProps<SelectValue>)}
        allowClear
        showSearch
        showArrow
        filterOption={(input, option) => {
          // 尝试从 option 的 children 中获取 data-filter 属性
          const filterText = (option.props as ExtendedOptionProps)['data-filter'];
          return filterText ? filterText.toLowerCase().includes(input.toLowerCase()) : false;
        }}
        optionFilterProp="children"
        onSearch={(val) => {
          setSearchText(val);
          return;
        }}
        onDropdownVisibleChange={(visible) => {
          setDropdownVisible(visible);

          if (!visible) {
            setSearchText(undefined);
            setList([]);
          }
        }}
        style={{
          width: '100%',
          ...selectProps.style,
        }}
        notFoundContent={null}
        // 自定义下拉内容，如果有初始化 list 的时候，希望也走 loading
        dropdownRender={(menu) =>
          loading ? (
            <Spin size="small" style={{ padding: 8, display: 'block', textAlign: 'center' }} />
          ) : (
            menu
          )
        }
      >
        {list.map((item) => {
          return (
            <Select.Option
              {...item}
              key={item[valueFieldName]}
              value={item[valueFieldName]}
              data-filter={item[filterFieldName]}
            >
              {highlightMatch(item[labelFieldName], searchText)}
            </Select.Option>
          );
        })}
      </Select>
    );
  },
);

export default FrontendFilteredSelect;
