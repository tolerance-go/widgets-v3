import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import DialogForm, { DialogFormBaseProps } from '../DialogForm';
import { Spin, message } from 'antd';

type StoreProps = {
  children?: (data: Record<string, any>) => React.ReactNode;
  request?: () => Promise<Record<string, any>>;
};

const Store = ({ children, request }: StoreProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const requestCounterRef = useRef(0); // 请求计数器

  const fetch = async () => {
    if (!request) return;
    const currentRequestIndex = ++requestCounterRef.current;
    try {
      setLoading(true);
      const newData = await request();

      if (currentRequestIndex === requestCounterRef.current) {
        setData(newData);
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
      message.error(errorMessage || '请求视图数据失败');
    } finally {
      if (currentRequestIndex === requestCounterRef.current) {
        setLoading(false);
      }
    }
  };

  useLayoutEffect(() => {
    fetch();
  }, []);

  return <Spin spinning={loading}>{children?.(data)}</Spin>;
};

export default Store;
