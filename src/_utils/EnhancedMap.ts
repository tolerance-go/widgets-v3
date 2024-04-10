class EnhancedMap<K, V> extends Map<K, V> {
  // 使用 filter 方法过滤掉指定的键
  filter(keyToFilterOut: K): EnhancedMap<K, V> {
    const filteredMap = new EnhancedMap<K, V>();
    this.forEach((value, key) => {
      if (key !== keyToFilterOut) {
        filteredMap.set(key, value);
      }
    });
    return filteredMap;
  }

  // 使用 getInverse 方法根据值找到第一个匹配的键
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
