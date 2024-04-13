import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { handleError } from 'src/_utils/handleError';

type StoreProps = {
  children?: (data: Record<string, any>) => React.ReactNode;
  request?: () => Promise<Record<string, any>>;
  name?: string;
  depends?: string[]; // 依赖的组件名称数组
};

export const useStore = (name: string) => {
  const context = useContext(StoreContext);
  return context[name];
};

// 创建一个context，用于保存按名称索引的数据和加载状态
export const StoreContext = createContext<Record<string, any>>({});

const Store = ({ children, request, name, depends = [] }: StoreProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const requestCounterRef = useRef(0);
  const context = useContext(StoreContext); // 使用context更新自己

  // 检查所有依赖的组件是否已加载完成
  const allDependenciesResolved = depends.every((dependency) => context[dependency]?.loaded);

  const fetch = async () => {
    if (!request || !allDependenciesResolved) return;
    const currentRequestIndex = ++requestCounterRef.current;
    try {
      setLoading(true);
      const newData = await request();

      if (currentRequestIndex === requestCounterRef.current) {
        setData(newData);
        if (name) {
          context[name] = { data: newData, loaded: true }; // 更新context中的数据和加载状态
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
  }, [allDependenciesResolved]); // 当依赖项的加载状态变化时，重新触发请求

  return (
    <StoreContext.Provider value={context}>
      <Spin spinning={loading}>{children?.(data)}</Spin>
    </StoreContext.Provider>
  );
};

export default Store;
