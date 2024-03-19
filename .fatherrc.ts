export default {
  // more father 4 config: https://github.com/umijs/father-next/blob/master/docs/config.md
  esm: {},
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib', // 指定从 lib 目录导入
        style: 'css', // 指定导入 css 文件
      },
      'antd',
    ],
  ],
};
