type Argument = string | number | null | undefined | ArgumentArray | { [key: string]: any };
interface ArgumentArray extends Array<Argument> {}

/**
 * 拼接className函数，支持字符串、数字、对象、数组等多种形式的输入。
 * @param args - 可以是字符串、数字、对象（键为类名，值为布尔值表示是否启用该类名）或者这些类型的嵌套数组。
 * @returns 拼接后的className字符串。
 */
function classNames(...args: Argument[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return; // 忽略null和undefined，false，''

    switch (typeof arg) {
      case 'string':
      case 'number':
        // 直接添加字符串和数字
        classes.push(arg.toString());
        break;
      case 'object':
        if (Array.isArray(arg)) {
          // 递归处理数组参数
          const inner = classNames(...arg);
          if (inner) {
            classes.push(inner);
          }
        } else {
          // 遍历对象参数，添加为真的键
          for (const key in arg) {
            if (arg[key]) {
              classes.push(key);
            }
          }
        }
        break;
    }
  });

  return classes.join(' ');
}

export { classNames };
