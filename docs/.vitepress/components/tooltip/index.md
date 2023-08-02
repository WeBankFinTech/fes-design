# Tooltip 文字提示

文字提示主要用于某个元素的辅助提示

## 组件注册

```js
import { FTooltip } from '@fesjs/fes-design';

app.use(FTooltip);
```

## 代码演示

### 基础用法

placement 设置弹出位置，分别是`top` `top-start` `top-end` `bottom` `bottom-start` `bottom-end` `right` `right-start` `right-end` `left` `left-start` `left-end`

--COMMON

### 确认弹出框

属性 mode="confirm"，点击时弹出确认框

--CONFIRM

### popover 弹出框

属性 mode="popover"，可以展示一些复杂的内容

--POPOVER

### 触发方式

属性 trigger 设置触发方式，`hover` `click` `focus`

--TRIGGER

--CODE

## Tooltip Props

| 属性          | 说明                                                                                                                                                  | 类型                      | 默认值                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | --------------------- |
| v-model       | 手动控制显示                                                                                                                                          | boolean                   | `false`               |
| mode          | 主题模式，可选`text` `confirm` `popover`                                                                                                              | string                    | `text`                |
| popperClass   | 弹出框的样式类名                                                                                                                                      | string \| object \| Array | -                     |
| title         | 标题(mode 为`text`不可用)                                                                                                                             | string \| number          | -                     |
| content       | 显示的内容                                                                                                                                            | string \| number          | -                     |
| placement     | 出现的位置，可选值有`top` `top-start` `top-end` `bottom` `bottom-start` `bottom-end` `right` `right-start` `right-end` `left` `left-start` `left-end` | string                    | `auto`                |
| trigger       | 触发类型`hover` `click` `focus`, confirm 模式下只能是`click`                                                                                          | string                    | `hover`               |
| disabled      | 是否可用                                                                                                                                              | boolean                   | `false`               |
| offset        | 出现位置的偏移量                                                                                                                                      | number                    | `8`                   |
| showAfter     | 显示的延迟时间                                                                                                                                        | number                    | `0`                   |
| hideAfter     | 隐藏的延迟时间                                                                                                                                        | number                    | `0`                   |
| arrow         | 是否显示箭头                                                                                                                                          | boolean                   | `true`                |
| confirmOption | mode 为`confirm`的配置                                                                                                                                | object                    | -                     |
| getContainer  | 配置渲染节点的输出位置                                                                                                                                | () => HTMLElement         | `() => document.body` |

### confirmOption 属性

| 属性       | 说明         | 类型   | 默认值                       |
| ---------- | ------------ | ------ | ---------------------------- |
| okText     | 确认按钮文字 | string | -                            |
| cancelText | 取消按钮文字 | string | -                            |
| icon       | 图标         | vNode  | `<ExclamationCircleFilled/>` |

## Tooltip Events

| 事件名称 | 说明                                 | 回调参数             |
| -------- | ------------------------------------ | -------------------- |
| ok       | 点击确定按钮回调，confirm 模式下有效 | Function(visible) {} |
| cancel   | 点击取消按钮回调，confirm 模式下有效 | Function(visible) {} |

## Tooltip Slots

| 名称    | 说明                           |
| ------- | ------------------------------ |
| default | 触发提示包裹的内容             |
| content | 提示的内容                     |
| title   | 提示的标题(mode 为`text`不可用 |
