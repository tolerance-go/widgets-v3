import { Select, Spin, message } from 'antd';
import { OptionProps, SelectProps, SelectValue } from 'antd/es/select';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
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
  valueFieldName?:
    | string
    | ((item: FrontendFilteredSelectListItem, index: number) => string | number);
  labelFieldName?: string | ((item: FrontendFilteredSelectListItem, index: number) => string);
  filterFieldName?: string | ((item: FrontendFilteredSelectListItem, index: number) => string);
  optionLabelFieldName?: string;
  request?: () => Promise<RequestResult<T>>;
  fetchOnMount?: boolean; // New boolean prop to control fetch on component mount
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
      optionLabelFieldName,
      request,
      fetchOnMount = false, // Default to false if not provided
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

    useEffect(() => {
      if (fetchOnMount) {
        fetchRef.current();
      }
    }, []);

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
        // TODO: children （combobox 模式下为 value）
        optionLabelProp={optionLabelFieldName ? 'data-option-label' : 'children'}
        onSearch={(val) => {
          setSearchText(val);
          return;
        }}
        onDropdownVisibleChange={(visible) => {
          setDropdownVisible(visible);

          if (!visible) {
            setSearchText(undefined);
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
        {list.map((item, index) => {
          const filterLabel =
            typeof filterFieldName === 'function'
              ? filterFieldName(item, index)
              : item[filterFieldName];

          const label =
            typeof labelFieldName === 'function'
              ? labelFieldName(item, index)
              : item[labelFieldName];

          const value =
            typeof valueFieldName === 'function'
              ? valueFieldName(item, index)
              : item[valueFieldName];

          const {
            disabled,
            value: itemValue,
            title,
            label: itemLabel,
            children,
            className,
            style,
          } = item;

          return (
            <Select.Option
              {...{
                disabled,
                value: itemValue,
                title,
                label: itemLabel,
                children,
                className,
                style,
              }}
              key={value}
              value={value}
              data-filter={filterLabel}
              data-option-label={optionLabelFieldName && item[optionLabelFieldName]}
            >
              {highlightMatch(label, searchText)}
            </Select.Option>
          );
        })}
      </Select>
    );
  },
);

export default FrontendFilteredSelect;
