import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  publicPath: '/widgets-v3/',
  base: '/widgets-v3/',
  title: 'widgets-v3',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  alias: {
    src: path.resolve(__dirname, 'src'),
    // 可以添加更多的别名配置
  },
  // more config: https://d.umijs.org/config
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
});
