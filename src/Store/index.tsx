import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { handleError } from 'src/_utils/handleError';
import useUpdateEffect from 'src/_utils/useUpdateEffect';

type StoreEntry = {
  data: Record<string, any>;
  loaded: boolean;
};

type StoreContextType = Record<string, StoreEntry | undefined>;

const StoreContext = createContext<StoreContextType>({});

export const useStore = (name: string) => {
  const context = useContext(StoreContext);
  return context[name]?.data;
};

type StoreProps = {
  children?: (data: Record<string, any>) => React.ReactNode;
  request?: () => Promise<Record<string, any>>;
  name?: string;
  depends?: string[];
};

const Store = ({ children, request, name, depends = [] }: StoreProps) => {
  const parentContext = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const requestCounterRef = useRef(0);

  // 新的state来维护当前Store和其父Store的数据
  const [context, setContext] = useState<StoreContextType>({ ...parentContext });

  const allDependenciesResolved = depends.every((dependency) => context[dependency]?.loaded);

  // 监听parentContext的变化，并更新context state
  useUpdateEffect(() => {
    setContext((prevContext) => ({ ...parentContext, ...prevContext }));
  }, [parentContext]);

  const fetch = async () => {
    if (!request || !allDependenciesResolved) return;
    const currentRequestIndex = ++requestCounterRef.current;
    try {
      setLoading(true);
      const newData = await request();
      if (currentRequestIndex === requestCounterRef.current) {
        setData(newData);
        setContext((prev) => {
          if (name) {
            return {
              ...prev,
              [name]: { data: newData, loaded: true },
            };
          }
          return prev;
        });
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
