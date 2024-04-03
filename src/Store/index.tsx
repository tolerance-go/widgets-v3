import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, message } from 'antd';

type StoreProps = {
  children?: (data: Record<string, any>) => React.ReactNode;
  request?: () => Promise<Record<string, any>>;
  name?: string; // 新增属性，用于标识每个Store
};

export const StoreContext = createContext<Record<string, any>>({});

const Store = ({ children, request, name }: StoreProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const requestCounterRef = useRef(0);

  // 使用 useContext 获取上级 Store 提供的数据
  const parentData = useContext(StoreContext);

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
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
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

  useEffect(() => {
    fetch();
  }, []);

  // 提供更新后的数据给子组件
  const value = useMemo(() => {
    return name ? { ...parentData, [name]: data } : data;
  }, [name, parentData, data]);

  return (
    <StoreContext.Provider value={value}>
      <Spin spinning={loading}>{children?.(value)}</Spin>
    </StoreContext.Provider>
  );
};

export default Store;
