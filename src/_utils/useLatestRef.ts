import { useEffect, useRef } from 'react';

/**
 * useLatestRef Hook 用来持续追踪传入值的最新引用。
 * 无论传入值何时改变，这个 Hook 都会更新并保持对该最新值的引用。
 * @param {T} currentValue - 当前要追踪的值，可以是对象、方法集合或任何其他类型。
 * @returns {React.MutableRefObject<T | undefined>} - 返回一个 ref 对象，其 .current 属性持有最新传入值的引用。
 */
function useLatestRef<T>(currentValue: T) {
  // 创建一个 ref 对象，这个对象用于存储传入值的最新引用
  const latestRef = useRef<T>(currentValue);

  // 当 currentValue 更新时，使用 useEffect 来同步更新 latestRef 的 .current 属性
  useEffect(() => {
    latestRef.current = currentValue;
  }, [currentValue]); // 将 currentValue 加入依赖项数组，确保其每次变化都会触发更新

  // 返回包含最新引用的 ref 对象
  return latestRef;
}

export default useLatestRef;
