import { Spin } from 'antd';
import React, {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import SchemaDescriptions, { DescriptionsComponentSchema } from '../SchemaDescriptions';

export interface RequestParams<T> {}

export interface RequestResult<T> {}

export type SmartDescriptionsProps<T> = {
  request?: (params: RequestParams<T>) => Promise<RequestResult<T>>;
  children?: (dataSource?: Record<string, any>) => ReactNode | DescriptionsComponentSchema[];
};

export type SmartDescriptionsMethods<T> = {};

const SmartDescriptions = forwardRef(
  <T extends {} = {}>(
    { request, children, ...tableProps }: SmartDescriptionsProps<T>,
    ref: ForwardedRef<SmartDescriptionsProps<T>>,
  ) => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<Record<string, any>>();

    const skipNextFetchRef = useRef(false);

    const fetch = async (params: RequestParams<T>) => {
      if (!request) return;

      setLoading(true);
      const result = await request(params);
      setDataSource(result); // TypeScript now knows this is T[]
      setLoading(false);
    };

    // 在组件内部创建methods对象
    const methods: SmartDescriptionsMethods<T> = {};

    // 更新useImperativeHandle钩子，直接使用methods对象
    useImperativeHandle(ref, () => methods);

    useEffect(() => {
      if (skipNextFetchRef.current) {
        skipNextFetchRef.current = false;
        return;
      }

      fetch({});
    }, []);

    // 检查变量是否是ReactNode（简化版本）
    function isReactNode(value: any): value is ReactNode {
      return (
        React.isValidElement(value) ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        (Array.isArray(value) && value.every(isReactNode)) ||
        value === null ||
        value === undefined
      );
    }

    // Render logic to handle both function and object children
    const renderChildren = () => {
      if (typeof children === 'function') {
        const result = children(dataSource);
        if (isReactNode(result)) {
          return result;
        }
        if (Array.isArray(result)) {
          return <SchemaDescriptions schema={result} />;
        }
        return result; // This handles the case where result is a ReactNode
      }
      return null;
    };

    return <Spin spinning={loading}>{renderChildren()}</Spin>;
  },
);

export default SmartDescriptions;
