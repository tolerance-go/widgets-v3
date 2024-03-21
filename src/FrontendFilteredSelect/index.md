---
group:
  order: 2
---

# FrontendFilteredSelect

前端过滤的下拉选项输入框

相较于直接使用，增加如下功能选项：

- 宽度默认 100%
- 按需加载
- 保证请求数据最新
- 封装服务请求代码

## 基本使用

<code src="./demos/basic" />

## 初始值

<code src="./demos/initialList" />

## 请求异常捕获自动打印

<code src="./demos/error-message" />

## Bug

### 关闭弹窗的时候，清空了 list，导致显示 value 而非 label

这个问题在项目环境中复现了，但是在这里复现不了，代码中做了特别优化
