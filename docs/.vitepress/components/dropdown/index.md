# Dropdown 下拉菜单

向下弹出的列表。

## 组件注册

```js
import { FDropdown } from '@fesjs/fes-design';

app.use(FDropdown);
```

## 代码演示

### 基础用法

简单的下拉菜单。

:::demo
common.vue
:::

### 选中效果

展示选中选项

:::demo
check.vue
:::

### 图标

菜单项可配置图标。

:::demo
icon.vue
:::

### 触发方式

触发下拉菜单弹出的行为有`hover`、`click`、`focus`、`contextmenu`

:::demo
trigger.vue
:::

### 弹出位置

弹出位置，可选`auto`、`auto-start`、`auto-end`、`top`、`top-start`、`top-end`、`bottom`、`bottom-start`、`bottom-end`、`right`、`right-start`、`right-end`、`left`、`left-start`、`left-end`

:::demo
placement.vue
:::

### 禁用

下拉菜单无法弹出。

:::demo
disabled.vue
:::

## Props

| 属性               | 说明                                                                                                                                                       | 类型                    | 默认值                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------- |
| options            | 下拉菜单选项配置                                                                                                                                           | Array\<DropdownOption\> | `[]`                  |
| valueField         | value 的属性名                                                                                                                                             | string                  | `value`               |
| labelField         | label 的属性名                                                                                                                                             | string                  | `label`               |
| visible            | 是否弹出                                                                                                                                                   | boolean                 | `false`               |
| appendToContainer  | 弹窗内容是否添加到指定的 DOM 元素                                                                                                                          | boolean                 | `true`                |
| getContainer       | 指定下拉选项挂载的 HTML 节点                                                                                                                               | () => HTMLElement       | `() => document.body` |
| trigger            | 触发弹窗的方式，可选`hover`、`click`、`focus`、`contextmenu`                                                                                               | string                  | `hover`               |
| placement          | 弹出位置，可选`top`、`top-start`、`top-end`、`bottom`、`bottom-start`、`bottom-end`、`right`、`right-start`、`right-end`、`left`、`left-start`、`left-end` | string                  | `bottom`              |
| offset             | 下拉菜单弹窗距离触发元素的距离,单位 px                                                                                                                     | number                  | `6`                   |
| disabled           | 是否禁用                                                                                                                                                   | boolean                 | `false`               |
| arrow              | 是否显示箭头                                                                                                                                               | boolean                 | `false`               |
| showSelectedOption | 是否显示选中选项                                                                                                                                           | boolean                 | `false`               |
| popperClass        | 弹出框容器样式                                                                                                                                             | string                  | -                     |

## Events

| 事件名称      | 说明                   | 回调参数               |
| ------------- | ---------------------- | ---------------------- |
| click         | 点击选项的回调         | (value) => void        |
| visibleChange | 菜单显示状态改变时调用 | (visible: Boolean) => void      |
| scroll        | 滚动事件               | (event: Event) => void |

## Slots

| 名称    | 说明               |
| ------- | ------------------ |
| default | 触发下拉菜单的内容 |

## DropdownOption

| 属性      | 说明                                                   | 类型                           | 默认值  |
| --------- | ------------------------------------------------------ | ------------------------------ | ------- |
| value     | 节点的 `key`，需要唯一，可使用 `valueField` 修改字段名 | string \| number               | `-`     |
| label     | 节点的内容，可使用 `labelField` 修改字段名             | string \| (item) => VNodeChild | `-`     |
| disabled? | 是否禁用节点                                           | boolean                        | `false` |
| icon?     | 节点的图标                                             | () => VNodeChild               | `null`  |
