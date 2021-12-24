# Form 表单

由输入框、单选框、复选框、下拉框等控件组成，用以收集、校验、提交数据。

## 组件注册

```js
import { FForm } from '@fesjs/fes-design';

app.use(FForm);
```

## 代码演示

### 基本使用
包括各种表单项，比如输入框、选择器、单选框、多选框等。

--BASIC

### 行内表单
当垂直方向空间受限且表单较简单时，可以使用行内表单模式。

--INLINE

### 对齐方式
根据具体目标和制约因素，选择最佳的标签对齐方式。

--ALIGN

### 表单验证
Form 组件提供表单验证的功能，通过 rules 属性传入约定的验证规则，并将 FormItem 的 prop 属性设置为需校验的字段名即可。表单验证目的在于尽可能让用户更早地发现并纠正错误。

--VALIDATE

--CODE



## Form Attributes

| 属性 | 说明 | 类型 | 默认值  |
| ------------- | ------------- | ------------- | ------------- |
| model | 表单数对象 | object | - |
| rules | 表单验证规则，可查看`async-validator` | object | - |
| layout | 表单布局，可选值为`horizontal`、`inline` | string | `horizontal` |
| labelPosition  | 表单域标签的位置，可选值为`left`、`top`、`right` | string | `left` |
| labelWidth  | 表单域标签的宽度。作为 Form 直接子元素的 form-item 会继承该值。| string(100px)、number(100) | - |
| labelClass  | 表单域标签自定义 class | string | - |
| showMessage  | 是否显示校验错误信息。| boolean | `true` |


## Form Methods

| 方法名称 | 说明 | 参数 |
| ------------- | ------------- | ------------- |
| validate  | 对整个表单进行校验，返回一个 promise。校验失败时，返回 `valid`、`values`、`errorFields` 信息，其中 `valid` 表示校验结果，`values` 表示包含未校验通过的字段，`errorFields` 表示错误信息 | `() => Promise()` |
| validateField  | 对部分表单字段进行校验，返回一个 promise。校验失败时，返回信息同 `validate`。  | `(prop: string) => Promise` |
| clearValidate | 移除表单项的校验结果 | - |
| resetFields | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | - |

## Form-Item Attributes

| 属性 | 说明 | 类型 | 默认值  |
| ------------- | ------------- | ------------- | ------------- |
| prop | 表单域 `model` 字段，在使用 `validate`、`resetFields` 方法的情况下，该属性是必填的 | string | - |
| rules | 表单项验证规则，可查看`Form-Item Rule Type` | object | - |
| label | 标签文本 | string | - |
| labelWidth  | 表单项标签的宽度 | string(100px)、number(100) | - |
| labelClass  | 表单项标签自定义 class | string | - |
| showMessage  | 是否显示校验错误信息 | boolean | `true` |

## Form-Item Methods

| 方法名称 | 说明 | 参数 |
| ------------- | ------------- | ------------- |
| validate  | 验证表单项。如果设定 trigger，该表项指定 trigger 规则会被使用；未设定 trigger，该表项所规则会被使用。shouldRuleBeApplied 可以用来进一步过滤已经经过 trigger 筛选的规则 | `(trigger) => Promise()` |



## Form-Item Rule Type
以下并不是规则的全部用法，如果你想了解更多的用法，请参考 <a href="https://github.com/yiminghe/async-validator" target="blank">async-validator </a>。
| 属性 | 说明 | 类型 |
| ------------- | ------------- | ------------- |
| trigger | 触发方式。`blur`、`change` 等 | string、Array |
| required | 是否必填 | boolean |
| message | 校验失败时展示的信息 | string |
| min | 最小长度 | number |
| max | 最大长度 | number |
| validator | 自定义校验 | function(rule, value) |
