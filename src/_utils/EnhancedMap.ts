class EnhancedMap<K, V> extends Map<K, V> {
  // filter 方法挑选指定的键或满足条件的键值对
  pick(...args: Array<K | ((key: K, value: V) => boolean)>): EnhancedMap<K, V> {
    const filteredMap = new EnhancedMap<K, V>();
    const filterKeys = args.filter((arg) => typeof arg !== 'function') as K[];
    const filterFuncs = args.filter((arg) => typeof arg === 'function') as Array<
      (key: K, value: V) => boolean
    >;

    this.forEach((value, key) => {
      if (filterKeys.includes(key) || filterFuncs.some((func) => func(key, value))) {
        filteredMap.set(key, value);
      }
    });
    return filteredMap;
  }

  // ignore 方法过滤掉指定的键或满足条件的键值对
  omit(...args: Array<K | ((key: K, value: V) => boolean)>): EnhancedMap<K, V> {
    const ignoredMap = new EnhancedMap<K, V>();
    const ignoreKeys = args.filter((arg) => typeof arg !== 'function') as K[];
    const ignoreFuncs = args.filter((arg) => typeof arg === 'function') as Array<
      (key: K, value: V) => boolean
    >;

    this.forEach((value, key) => {
      if (!ignoreKeys.includes(key) && !ignoreFuncs.some((func) => func(key, value))) {
        ignoredMap.set(key, value);
      }
    });
    return ignoredMap;
  }

  // getInverse 方法根据值找到第一个匹配的键
  getInverse(valueToFind: V): K | undefined {
    for (let [key, value] of this) {
      if (value === valueToFind) {
        return key;
      }
    }
    return undefined;
  }
}

export default EnhancedMap;
