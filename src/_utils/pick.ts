export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  let result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// // 使用示例
// const obj = { name: 'Tom', age: 25, location: 'New York' };
// const picked = pick(obj, 'name', 'age');
// console.log(picked); // { name: 'Tom', age: 25 }
