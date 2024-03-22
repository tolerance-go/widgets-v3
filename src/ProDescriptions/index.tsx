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

export interface RequestParams<T> {}

export interface RequestResult<T> {}

export type ProDescriptionsProps<T> = {
  request?: (params: RequestParams<T>) => Promise<RequestResult<T>>;
  children?: (dataSource?: Record<string, any>) => ReactNode;
};

export type ProDescriptionsMethods<T> = {};

const ProDescriptions = forwardRef(
  <T extends {} = {}>(
    { request, children, ...tableProps }: ProDescriptionsProps<T>,
    ref: ForwardedRef<ProDescriptionsProps<T>>,
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
    const methods: ProDescriptionsMethods<T> = {};

    // 更新useImperativeHandle钩子，直接使用methods对象
    useImperativeHandle(ref, () => methods);

    useEffect(() => {
      if (skipNextFetchRef.current) {
        skipNextFetchRef.current = false;
        return;
      }

      fetch({});
    }, []);

    return <Spin spinning={loading}>{children?.(dataSource)}</Spin>;
  },
);

export default ProDescriptions;
