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

  test('filter should pick the specified keys', () => {
    const filteredMap = map.pick(0, 2);
    expect(filteredMap.size).toBe(2);
    expect(filteredMap.has(0)).toBeTruthy();
    expect(filteredMap.has(2)).toBeTruthy();
  });

  test('filter should pick keys that satisfy the condition', () => {
    const filteredMap = map.pick((key, value) => value.includes('审核'));
    expect(filteredMap.size).toBe(3);
    expect(filteredMap.has(1)).toBeTruthy();
    expect(filteredMap.has(2)).toBeTruthy();
    expect(filteredMap.has(3)).toBeTruthy();
  });

  test('ignore should filter out the specified keys', () => {
    const ignoredMap = map.omit(1, 3);
    expect(ignoredMap.size).toBe(2);
    expect(ignoredMap.has(0)).toBeTruthy();
    expect(ignoredMap.has(2)).toBeTruthy();
  });

  test('ignore should filter out keys that satisfy the condition', () => {
    const ignoredMap = map.omit((key, value) => value.includes('审核'));
    expect(ignoredMap.size).toBe(1);
    expect(ignoredMap.has(0)).toBeTruthy();
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
