import EnhancedMap from './EnhancedMap';

describe('EnhancedMap', () => {
  let map: EnhancedMap<number, string>;

  beforeEach(() => {
    map = new EnhancedMap([
      [0, '待提交'],
      [1, '待审核'],
      [2, '审核通过'],
      [3, '审核驳回'],
    ]);
  });

  test('filter should return a new map without the filtered key', () => {
    const filteredMap = map.filter(1);
    expect(filteredMap.has(1)).toBe(false);
    expect(filteredMap.size).toBe(3);
  });

  test('getInverse should return the key for a given value', () => {
    const key = map.getInverse('审核通过');
    expect(key).toBe(2);
  });

  test('getInverse should return undefined for a value that does not exist', () => {
    const key = map.getInverse('不存在的值');
    expect(key).toBeUndefined();
  });
});
