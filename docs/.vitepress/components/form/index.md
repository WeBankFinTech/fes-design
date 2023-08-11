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

### 表单禁用

当需要设置整个表单不可用的时候,可以设置 disabled 属性。表单包裹的组件均会设置为禁用状态。

--DISABLED

### 表单验证

Form 组件提供表单验证的功能，通过 rules 属性传入约定的验证规则，并将 FormItem 的 prop 属性设置为需校验的字段名即可。表单验证目的在于尽可能让用户更早地发现并纠正错误。

--VALIDATE

### 复杂表单验证

复杂表单校验场景：自定义规则、联动校验、动态组件单个选项/整体校验。

--COMPLEXVALIDATE

--CODE

## Form Attributes

| 属性            | 说明                                                            | 类型                       | 默认值       |
| --------------- | --------------------------------------------------------------- | -------------------------- | ------------ |
| model           | 表单数对象                                                      | object                     | -            |
| rules           | 表单验证规则，可查看`async-validator`                           | object                     | -            |
| layout          | 表单布局，可选值为`horizontal`、`inline`                        | string                     | `horizontal` |
| inlineItemWidth | 仅在 `inline` 表单中有效。统一定义 FormItem 固定宽度            | string、number             | -            |
| inlineItemGap   | 仅在 `inline` 表单中有效。统一定义整行 FormItem 的间距          | string、number             | 11px         |
| span            | 仅在 `inline` 表单中有效。统一定义 FormItem 占据列数，共 24 列  | number                     | 6            |
| labelPosition   | 表单域标签的位置，可选值为`left`、`top`、`right`                | string                     | `left`       |
| labelWidth      | 表单域标签的宽度。作为 Form 直接子元素的 form-item 会继承该值。 | string(100px)、number(100) | -            |
| labelClass      | 表单域标签自定义 class                                          | string                     | -            |
| showMessage     | 是否显示校验错误信息。                                          | boolean                    | `true`       |
| disabled        | 表单是否可用                                                    | boolean                    | `false`      |

## Form Methods

| 方法名称      | 说明                                                                                                                                                                                                                     | 参数                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| validate      | 对整体表单、部分表单（传入`fieldProps`数组）进行校验，返回一个 promise。校验失败时，返回 `valid`、`values`、`errorFields` 信息，其中 `valid` 表示校验结果，`values` 表示包含未校验通过的字段，`errorFields` 表示错误信息 | `(fieldProps?: []) => Promise()` |
| clearValidate | 移除表单项的校验结果                                                                                                                                                                                                     | -                                |
| resetFields   | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果                                                                                                                                                               | -                                |

## Form Events

| 事件名称 | 说明                 | 回调参数        |
| -------- | -------------------- | --------------- |
| submit   | 表单原生提交事件触发 | (event) => void |

## Form-Item Attributes

| 属性        | 说明                                                                               | 类型                       | 默认值 |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------- | ------ |
| prop        | 表单域 `model` 字段，在使用 `validate`、`resetFields` 方法的情况下，该属性是必填的 | string                     | -      |
| value       | 表单项的值。如果存在则优先取该属性                                                 | string                     | -      |
| rules       | 表单项验证规则，可查看`Form-Item Rule Type`                                        | Array                      | -      |
| span        | 仅在 `inline` 表单中有效。自定义 FormItem 占据列数，共 24 列                       | number                     | -      |
| label       | 标签文本                                                                           | string                     | -      |
| labelWidth  | 表单项标签的宽度                                                                   | string(100px)、number(100) | -      |
| labelClass  | 表单项标签自定义 class                                                             | string                     | -      |
| showMessage | 是否显示校验错误信息                                                               | boolean                    | `true` |

## Form-Item Slots

| 名称  | 说明                 |
| ----- | -------------------- |
| label | 自定义表单项标签文本 |

## Form-Item Methods

| 方法名称 | 说明                                                                                                                                                                   | 参数                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| validate | 验证表单项。如果设定 trigger，该表项指定 trigger 规则会被使用；未设定 trigger，该表项所规则会被使用。shouldRuleBeApplied 可以用来进一步过滤已经经过 trigger 筛选的规则 | `(trigger) => Promise()` |

## Form-Item Rule Type

以下并不是规则的全部用法，如果你想了解更多的用法，请参考 <a href="https://github.com/yiminghe/async-validator" target="blank">async-validator </a>。
| 属性 | 说明 | 类型 | 默认值 |
| ------------- | ------------- | ------------- | ------------- |
| trigger | 校验触发的时机 | string、Array | - |
| required | 是否必填 | boolean | false |
| message | 校验失败时展示的信息 | string | - |
| type | 内建校验类型，<a href="https://github.com/yiminghe/async-validator#type" target="blank">可选项</a> 【注意: 非`string`类型都需要指明 type】 | string | 'string' |
| min | 最小长度 | number | - |
| max | 最大长度 | number | - |
| validator | 自定义校验【注意，<a href="https://github.com/ant-design/ant-design/issues/5155" target="blank">callback 必须被调用】</a> | function(rule, value, callback) | - |
