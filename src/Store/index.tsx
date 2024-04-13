import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { handleError } from 'src/_utils/handleError';

// 定义存储在context中的每个数据条目的类型
type StoreEntry = {
  data: Record<string, any>;
  loaded: boolean; // 表示数据是否已加载完成
};

// 更新StoreContext的类型，使其可以包括StoreEntry类型的数据
type StoreContextType = Record<string, StoreEntry | undefined>;

export const useStore = (name: string) => {
  const context = useContext(StoreContext);
  return context[name]?.data;
};

// 使用更新后的类型初始化StoreContext
export const StoreContext = createContext<StoreContextType>({});

type StoreProps = {
  children?: (data: Record<string, any>) => React.ReactNode;
  request?: () => Promise<Record<string, any>>;
  name?: string;
  depends?: string[]; // 依赖的组件名称数组
};

const Store = ({ children, request, name, depends = [] }: StoreProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const requestCounterRef = useRef(0);
  const context = useContext(StoreContext);

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
          context[name] = { data: newData, loaded: true };
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
  }, [allDependenciesResolved]);

  return (
    <StoreContext.Provider value={context}>
      <Spin spinning={loading}>{children?.(data)}</Spin>
    </StoreContext.Provider>
  );
};

export default Store;
