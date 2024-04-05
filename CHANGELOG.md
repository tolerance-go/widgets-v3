# [0.23.0](https://gitee.com/bzone/widgets-v3/compare/v0.22.0...v0.23.0) (2024-04-05)


### Features

* **LoginForm:** 新增 LoginForm 组件 ([d3f85ad](https://gitee.com/bzone/widgets-v3/commits/d3f85ade49bb70c3e9483abfb735506e3a8d7a47))
* **Store:** 新增 Store 组件 ([ec9be7f](https://gitee.com/bzone/widgets-v3/commits/ec9be7f97dede5a3de68d5c31a869f5735e8996a))
* **Store:** 支持嵌套功能 ([b0fc75c](https://gitee.com/bzone/widgets-v3/commits/b0fc75cfab0772afc00ffee021da94b76a167702))



# [0.22.0](https://gitee.com/bzone/widgets-v3/compare/v0.21.0...v0.22.0) (2024-04-03)


### Features

* **FrontendFilteredSelect:** onChange 回调注入 methods 方法集 ([bccdf5e](https://gitee.com/bzone/widgets-v3/commits/bccdf5e790d0c4670607aff67bf1d3ab4d9fe29a))
* **SearchTable:** column 的 render 方法注入请求额外数据用于枚举等特殊渲染 ([cbfad65](https://gitee.com/bzone/widgets-v3/commits/cbfad65998f8dd49d235adb210188128fc27bf84))


### BREAKING CHANGES

* **SearchTable:** request 返回的数据列表字段从 data 改为 list



# [0.21.0](https://gitee.com/bzone/widgets-v3/compare/v0.20.0...v0.21.0) (2024-04-03)


### Features

* **FrontendFilteredSelect:** 新增 valueEnum 接口 ([40968d8](https://gitee.com/bzone/widgets-v3/commits/40968d892f12243b02799abaae85e991c4bfa913))



# [0.20.0](https://gitee.com/bzone/widgets-v3/compare/v0.19.0...v0.20.0) (2024-04-02)


### Bug Fixes

* **EditableTable:** 兼容恢复开关默认值 ([05b190b](https://gitee.com/bzone/widgets-v3/commits/05b190bc888856a227839150253560cc6d229e80))
* **EditableTable:** 修复分页大小切换失效的问题 ([9612221](https://gitee.com/bzone/widgets-v3/commits/9612221ee3862a73ba39061c6e769932fd86f167))
* **EditableTabs:** 修复点击删除的时候 TabsForm 无法删除表单内存数据 ([79723ff](https://gitee.com/bzone/widgets-v3/commits/79723ff1c49bc663ec7e14a3ae7ff07235ab910d))


### Features

* **EditableTable:** 新增功能开关 ([8b5791c](https://gitee.com/bzone/widgets-v3/commits/8b5791cf8e55e0a22f2f33e2b3034efb54441cf0))
* **EditableTable:** 支持行编辑功能 ([a39385a](https://gitee.com/bzone/widgets-v3/commits/a39385aa0dd38aeda0d2d8841fd339f35c6d3e88))
* **Form:** 新增 onValuesChange 的接口 ([96ff6c2](https://gitee.com/bzone/widgets-v3/commits/96ff6c2aa9fb0bc7ce9a7d4a8905a609b2fff3a3))
* **FormDependency:** 新增 FormDependency 组件 ([87a6fa8](https://gitee.com/bzone/widgets-v3/commits/87a6fa8c150e4247a62a72454950bb3ff8ac60a1))



# [0.19.0](https://gitee.com/bzone/widgets-v3/compare/v0.18.1...v0.19.0) (2024-04-01)


### Features

* **FullscreenImage:** 新增 trigger 功能 ([cad0dba](https://gitee.com/bzone/widgets-v3/commits/cad0dbad385154c092c3533ad68b224956274b4c))



## [0.18.1](https://gitee.com/bzone/widgets-v3/compare/v0.18.0...v0.18.1) (2024-03-31)


### Bug Fixes

* **ProForm:** 修复组件返回类型报错 ([93d5d4e](https://gitee.com/bzone/widgets-v3/commits/93d5d4ec5f107863196a706bf838ba7c580a3c19))



# [0.18.0](https://gitee.com/bzone/widgets-v3/compare/v0.17.0...v0.18.0) (2024-03-31)


### Features

* **Form:** 自动检测是否为嵌套 form，同构嵌套表单组件的代码，无需做修改 ([0aa78e2](https://gitee.com/bzone/widgets-v3/commits/0aa78e21fe4928a91e35ce13451c059a1d25df12))


### BREAKING CHANGES

* **Form:** 删除 inForm 参数



# [0.17.0](https://gitee.com/bzone/widgets-v3/compare/v0.16.1...v0.17.0) (2024-03-31)


### Features

* **DialogForm:** 新增 stopWrapClickPropagation 参数 ([d534086](https://gitee.com/bzone/widgets-v3/commits/d534086fca07e8fed7025aec6a54fa05d9073f9b))
* **EditableTabs:** 新增 EditableTabs 组件 ([15af77f](https://gitee.com/bzone/widgets-v3/commits/15af77f8d2d9548354d3088b1aa8e6532e858aff))
* **TabsForm:** 新增 TabsForm 组件 ([4aaf0d0](https://gitee.com/bzone/widgets-v3/commits/4aaf0d07be91cdc5382d77669abe1c867da733b6))



## [0.16.1](https://gitee.com/bzone/widgets-v3/compare/v0.16.0...v0.16.1) (2024-03-29)


### Bug Fixes

* **FullscreenImage:** 优化样式，只有点击遮罩和关闭按钮才可以关闭 ([68bdd6d](https://gitee.com/bzone/widgets-v3/commits/68bdd6d6cb0993b3799c152888608bd106557b26))



# [0.16.0](https://gitee.com/bzone/widgets-v3/compare/v0.15.0...v0.16.0) (2024-03-29)


### Features

* **FrontendFilteredSelect:** 新增 fetchOnMount 参数 ([af99467](https://gitee.com/bzone/widgets-v3/commits/af994671a02b2796ff0d9006bea053eb52ec9802))



# [0.15.0](https://gitee.com/bzone/widgets-v3/compare/v0.14.0...v0.15.0) (2024-03-28)


### Features

* **FrontendFilteredSelect:** 支持 valueFieldName 传递函数形式 ([afa262a](https://gitee.com/bzone/widgets-v3/commits/afa262a69c86cc19ddec5a35030681b9965af013))



# [0.14.0](https://gitee.com/bzone/widgets-v3/compare/v0.13.0...v0.14.0) (2024-03-28)


### Features

* **FrontendFilteredSelect:** 新增 optionLabelFieldName 控制回填展示 ([6509858](https://gitee.com/bzone/widgets-v3/commits/650985876cb19de34d3601dd4dcc27d76caaf821))
* **FullscreenImage:** 新增 FullscreenImage 组件 ([d009451](https://gitee.com/bzone/widgets-v3/commits/d009451336c900a72ac510f63d5fe41797602b71))



# [0.13.0](https://gitee.com/bzone/widgets-v3/compare/v0.12.0...v0.13.0) (2024-03-27)


### Bug Fixes

* **SearchForm:** 默认展示数量小于实际数量的时候，才显示展开和关闭 ([a3e26a4](https://gitee.com/bzone/widgets-v3/commits/a3e26a4ce921f9bce9e2d0e3bc13c861285b9322))
* **SearchForm:** 修复搜索按钮没有空位显示的时候就消失了的问题 ([30cb463](https://gitee.com/bzone/widgets-v3/commits/30cb46332cb8deabfaf14bb7f7d9222473ced87f))
* **SearchForm:** 优化样式，减少空隙 ([7589877](https://gitee.com/bzone/widgets-v3/commits/7589877e5f6840e8f9c615543fd2e6504a9d1adf))


### Features

* **SchemaForm:** 新增 SchemaForm ([4ff4f51](https://gitee.com/bzone/widgets-v3/commits/4ff4f51d0ccdaa79e5742096215fd0682f03c0c1))
* **SearchTable:** columns 支持函数形式 ([44c37f7](https://gitee.com/bzone/widgets-v3/commits/44c37f7a3d7404ffa8d662577e7761078c36195a))



# [0.12.0](https://gitee.com/bzone/widgets-v3/compare/v0.11.1...v0.12.0) (2024-03-26)


### Features

* 新增 useUpdateEffect 导出 ([55dbc8e](https://gitee.com/bzone/widgets-v3/commits/55dbc8eeabedeb947a46128f7f3b10bab1f69f76))



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



