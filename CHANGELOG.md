## [0.11.1](https://gitee.com/bzone/widgets-v3/compare/v0.11.0...v0.11.1) (2024-03-24)


### Bug Fixes

* **EditableTable:** 首部添加一行数据的时候，如果不在第一页，需要回到第一页 ([dd4816a](https://gitee.com/bzone/widgets-v3/commits/dd4816ae4224bb8eda4fafc17d3442bf3921c6ef))



# [0.11.0](https://gitee.com/bzone/widgets-v3/compare/v0.10.1...v0.11.0) (2024-03-24)


### Bug Fixes

* 修复 antd 的 es 引入 ([666ec0b](https://gitee.com/bzone/widgets-v3/commits/666ec0b52a103071471c947c9171175f96956d09))
* **BackendFilteredSelect:** 修复请求没有返回前，关闭弹窗，再次打开显示错误的问题 ([adfce77](https://gitee.com/bzone/widgets-v3/commits/adfce77cff03dacec6b0fb0f9953f76e8296b038))


### Features

* **DialogForm:** 支持 renderFormItems 不传 ([0d1a9d6](https://gitee.com/bzone/widgets-v3/commits/0d1a9d66685e96ce0f58825bbe792c0082266363))
* **DrawerForm:** 新增 DrawerForm 组件 ([99088f6](https://gitee.com/bzone/widgets-v3/commits/99088f63480802b1473a1f8ecad095be5adeee6d))
* **EditableTable:** 新增 EditableTable 组件 ([2568913](https://gitee.com/bzone/widgets-v3/commits/256891361ed6fdbf7a493a2e6dc8be2dd92ec916))
* **EditableTable:** 支持拖拽排序和插入功能 ([161fca4](https://gitee.com/bzone/widgets-v3/commits/161fca4614dd94d37885fe8bfc7f61517f47a906))
* **ProDescriptions:** 新增 ProDescriptions 组件 ([dd654cb](https://gitee.com/bzone/widgets-v3/commits/dd654cb981759bdaa3bbe0787f5c8a69b780cd34))
* **ProDescriptions:** 支持返回 schema 渲染 ([da859e3](https://gitee.com/bzone/widgets-v3/commits/da859e3a4c9b20252b9150abeb528a00bee3f28d))
* **SchemaDescriptions:** 新增 SchemaDescriptions 组件 ([245d215](https://gitee.com/bzone/widgets-v3/commits/245d215104012552d7f8ccee1322026e618e555c))
* **SchemaDescriptions:** 支持传递数组 ([ffd9cc6](https://gitee.com/bzone/widgets-v3/commits/ffd9cc626686501bbd1a6bc450117752f84878e5))
* **SchemaDescriptions:** 支持渲染表格 ([08fbcd4](https://gitee.com/bzone/widgets-v3/commits/08fbcd4ba5f0e7478ab950e21f6a9907b68a6147))
* **SearchTable:** 新增 tabs 接口 ([ce8b59b](https://gitee.com/bzone/widgets-v3/commits/ce8b59b04930158145ea732475ef3b323c53a6b7))
* **SearchTable:** 支持行选择和批量操作功能 ([15f6b7f](https://gitee.com/bzone/widgets-v3/commits/15f6b7f863c973b0b1c7abf680deec1338abfbb7))


### BREAKING CHANGES

* **SchemaDescriptions:** 字面量对象需要改为数组，影响包括 ProDescriptions 和 SchemaDescriptions



## [0.10.1](https://gitee.com/bzone/widgets-v3/compare/v0.10.0...v0.10.1) (2024-03-22)


### Bug Fixes

* **EllipsisTooltip:** 修复 text 类型问题不包含 node ([8f76620](https://gitee.com/bzone/widgets-v3/commits/8f76620585246014d8bce8aa17f3b8760dd0dbd1))



# [0.10.0](https://gitee.com/bzone/widgets-v3/compare/v0.9.4...v0.10.0) (2024-03-22)


### Features

* **EllipsisTooltip:** 新增 EllipsisTooltip 组件，自动处理文本缩略和提示 ([1e92b9a](https://gitee.com/bzone/widgets-v3/commits/1e92b9ad0a2b420d1d3a466d8dde4917084ab9d1))



## [0.9.4](https://gitee.com/bzone/widgets-v3/compare/v0.9.3...v0.9.4) (2024-03-22)


### Bug Fixes

* **BackendFilteredSelectListItem:** 搜索后，只显示 loading，不展示 menu；如果只有第一页数据，就显示完了，不展示“没有更多了” ([4629aed](https://gitee.com/bzone/widgets-v3/commits/4629aed4384f840820596aa29bedf1fa32264ebd))



## [0.9.3](https://gitee.com/bzone/widgets-v3/compare/v0.9.2...v0.9.3) (2024-03-21)


### Bug Fixes

* **BackendFilteredSelect:** 修复下拉清空选项后只显示 value 的问题 ([17e7b1a](https://gitee.com/bzone/widgets-v3/commits/17e7b1a488940d6df98a2e17e564b542b2fff964))



## [0.9.2](https://gitee.com/bzone/widgets-v3/compare/v0.9.1...v0.9.2) (2024-03-21)


### Bug Fixes

* **FrontendFilteredSelect:** 关闭的时候不重置 list ([b32e38e](https://gitee.com/bzone/widgets-v3/commits/b32e38eacfa6c5540185efb8fb46c2b287e381b4))



## [0.9.1](https://gitee.com/bzone/widgets-v3/compare/v0.9.0...v0.9.1) (2024-03-21)


### Bug Fixes

* **FrontendFilteredSelect:** 关闭弹窗不显示 label 的问题 ([b356d53](https://gitee.com/bzone/widgets-v3/commits/b356d5375085c944abd09865462af744b229dbdd))


### Features

* **FrontendFilteredSelect:** 新增请求异常报错 ([58ccb1b](https://gitee.com/bzone/widgets-v3/commits/58ccb1b874cf1cf41d4b9c23d09c72218319a8c8))



# [0.9.0](https://gitee.com/bzone/widgets-v3/compare/v0.8.0...v0.9.0) (2024-03-21)


### Bug Fixes

* **ModalForm:** 关闭按钮应该放在自定义按钮的左侧 ([79f3f45](https://gitee.com/bzone/widgets-v3/commits/79f3f45b938496bbc3f290208eac3e114b9295b2))


### Features

* **FrontendFilteredSelect:** 新增前端过滤的下拉组件 ([57fa51d](https://gitee.com/bzone/widgets-v3/commits/57fa51d917ee47e8b3c8f2569340f157a311186a))
* **ProForm:** 将 BaseForm 改名为 ProForm ([24d1fc6](https://gitee.com/bzone/widgets-v3/commits/24d1fc64332a353f60f7a3d9557b9140d2022c0b))



# [0.8.0](https://gitee.com/bzone/widgets-v3/compare/v0.7.0...v0.8.0) (2024-03-19)


### Features

* **BaseForm:** 新增基础表单组件 ([d886ef1](https://gitee.com/bzone/widgets-v3/commits/d886ef131a709f3346bd318b7cd37244ac20ba75))



# [0.7.0](https://gitee.com/bzone/widgets-v3/compare/v0.6.7...v0.7.0) (2024-03-19)


### Features

* **BackendFilteredSelect:** 新增后端分页下拉选择器 ([64a5655](https://gitee.com/bzone/widgets-v3/commits/64a5655d75624f25957d2bf7ea222c050158619d))



## [0.6.7](https://gitee.com/bzone/widgets-v3/compare/v0.6.6...v0.6.7) (2024-03-19)


### Bug Fixes

* esm 导出样式改为 style ([8b247e9](https://gitee.com/bzone/widgets-v3/commits/8b247e996e248f94b204cc0a02206f94d994700d))



## [0.6.6](https://gitee.com/bzone/widgets-v3/compare/v0.6.5...v0.6.6) (2024-03-19)


### Bug Fixes

* 指定 platform 为 browser ([4b1f288](https://gitee.com/bzone/widgets-v3/commits/4b1f2882a9bdd52ea8964772e35197aaf1fefff9))



## [0.6.5](https://gitee.com/bzone/widgets-v3/compare/v0.6.4...v0.6.5) (2024-03-19)


### Bug Fixes

* 删除 esm 模块导出 ([7bd6001](https://gitee.com/bzone/widgets-v3/commits/7bd60018410b3d8787fbe6c63379c79914a78586))



## [0.6.4](https://gitee.com/bzone/widgets-v3/compare/v0.6.3...v0.6.4) (2024-03-19)


### Bug Fixes

* 新增 cjs 模块导出 ([470f0d1](https://gitee.com/bzone/widgets-v3/commits/470f0d107184c777ac2f20556eff0d5a7b4fae0d))



## [0.6.3](https://gitee.com/bzone/widgets-v3/compare/v0.6.2...v0.6.3) (2024-03-19)


### Bug Fixes

* 打包改为 esm ([e3d1744](https://gitee.com/bzone/widgets-v3/commits/e3d1744ff4400a72d14f97d2c6858915b66411cf))



## [0.6.2](https://gitee.com/bzone/widgets-v3/compare/v0.6.1...v0.6.2) (2024-03-19)


### Bug Fixes

* 修改打包平台 ([8a00e3a](https://gitee.com/bzone/widgets-v3/commits/8a00e3a56a26495014e00fcee74c7279f893f269))



## [0.6.1](https://gitee.com/bzone/widgets-v3/compare/v0.6.0...v0.6.1) (2024-03-18)


### Bug Fixes

* **SearchTable:** 修复错误依赖调用请求 ([edaf4a7](https://gitee.com/bzone/widgets-v3/commits/edaf4a7b7a4267d5183e998878a3644d12f1dde4))



# [0.6.0](https://gitee.com/bzone/widgets-v3/compare/v0.5.0...v0.6.0) (2024-03-18)


### Bug Fixes

* **ModalForm:** 关闭后再次打开要请求初始化数据 ([80dbec1](https://gitee.com/bzone/widgets-v3/commits/80dbec11293898848e42be2e40b01f99d1dba6ac))


### Features

* **SearchTable:** 新增 reload 方法 ([158c90b](https://gitee.com/bzone/widgets-v3/commits/158c90b28f80e16c97b218365ad1ec760835809f))



# [0.5.0](https://gitee.com/bzone/widgets-v3/compare/v0.4.0...v0.5.0) (2024-03-18)


### Features

* **Action:** 支持打印自定义错误消息 ([455bf15](https://gitee.com/bzone/widgets-v3/commits/455bf157fdaee2635d3d4d0d33fafee3e574ba21))



# [0.4.0](https://gitee.com/bzone/widgets-v3/compare/v0.3.0...v0.4.0) (2024-03-18)


### Bug Fixes

* **SearchForm:** 修复按钮的位置问题 ([6cd9743](https://gitee.com/bzone/widgets-v3/commits/6cd974331ad174c371bd62cafa4af6c099808a60))


### Features

* **SearchTable:** 新增 headerTitle 和 renderActionGroup 方法 ([8465700](https://gitee.com/bzone/widgets-v3/commits/8465700213d2237da572da86841c02108a52420d))



# [0.3.0](https://gitee.com/bzone/widgets-v3/compare/v0.2.0...v0.3.0) (2024-03-18)


### Features

* 新增 Action；重构 modal form ([b98989c](https://gitee.com/bzone/widgets-v3/commits/b98989cb7211f258537267ff4db985bdbc527ae0))



# [0.2.0](https://gitee.com/bzone/widgets-v3/compare/v0.1.0...v0.2.0) (2024-03-17)


### Features

* 新增表格组件 ([1b7c917](https://gitee.com/bzone/widgets-v3/commits/1b7c91734cb5595e21bdbbc7d10ea08cf8c5cb18))



# 0.1.0 (2024-03-17)



