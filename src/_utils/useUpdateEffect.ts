import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * useUpdateEffect Hook 只在依赖项更新时触发
 * @param effect 副作用函数，符合 React 的 EffectCallback 类型
 * @param deps 依赖项数组，符合 React 的 DependencyList 类型
 */
function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
  }, deps);
}

export default useUpdateEffect;
