export default {
  // more father 4 config: https://github.com/umijs/father-next/blob/master/docs/config.md
  esm: {},
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, // 指定导入 css 文件
      },
      'antd',
    ],
  ],
};
