import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { handleError } from 'src/_utils/handleError';

type StoreProps = {
  children?: (data: Record<string, any>) => React.ReactNode;
  request?: () => Promise<Record<string, any>>;
  name?: string; // 用于标识每个Store的可选属性
};

export const useStore = (name: string) => {
  const context = useContext(StoreContext);
  return context[name];
};

// 创建一个context，用于保存按名称索引的数据
export const StoreContext = createContext<Record<string, any>>({});

const Store = ({ children, request, name }: StoreProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const requestCounterRef = useRef(0);
  const context = useContext(StoreContext); // 使用context更新自己

  const fetch = async () => {
    if (!request) return;
    const currentRequestIndex = ++requestCounterRef.current;
    try {
      setLoading(true);
      const newData = await request();

      if (currentRequestIndex === requestCounterRef.current) {
        setData(newData);
        if (name) {
          context[name] = newData; // 如果提供了名称，则在context中设置数据
        }
      }
    } catch (error) {
      handleError(error, '请求视图数据失败');
    } finally {
      if (currentRequestIndex === requestCounterRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <StoreContext.Provider value={context}>
      <Spin spinning={loading}>{children?.(data)}</Spin>
    </StoreContext.Provider>
  );
};

export default Store;
