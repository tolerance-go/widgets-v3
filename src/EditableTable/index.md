---
group:
  title: Editable
  order: 4
---

# EditableTable

可编辑表格

- ts 编写，完整的类型支持
- 可以添加和删除行
- 可以对行进行编辑和保存
- 支持 value 和 onChange 接口，可以和 Form 结合使用

交互细节

- 每一行最末尾有一个操作列表，出现了 编辑 和 删除按钮
  - 点击编辑后，整行进入编辑状态（排除不可编辑的列，用户定义），此时用户可以点击保存，会进行表单验证，错误消息通过 Popover 显示
  - 点击删除，显示气泡弹窗确认
- 表格支持两种插入模式，一个是向前插入，一个是向末尾插入，在表格的 body 的上方或者下方显示一个 block 按钮支持该功能

实现细节

- 使用 antd@3 编写组件
- 自定义 row 要用 Form.create 包裹
- 使用 hook 来编写组件
- 自定义表格行，进入行编辑状态后，使用当前 record 的字段值来初始化当前单元格，getFieldDecorator 内部的组件通过 render 获取，但是 render 增加一个 editing 状态参数给用户，可以通过柯里化的方式传入，把 render 的类型改为返回函数的函数，额外参数通过最外层参数传递
- form 的类型是 WrappedFormUtils 来自 antd/es/form/Form

## 基本使用

<code src="./demos/basic" />

## 不分页

<code src="./demos/no-page" />

## 选中行

<code src="./demos/selectable" />

## 功能开关

<code src="./demos/enable" />
