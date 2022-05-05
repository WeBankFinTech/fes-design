# SelectCascader 级联选择器

当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

## 组件注册

```js
import { FSelectCascader } from '@fesjs/fes-design';

app.use(FSelectCascader);
```

## 代码演示

### 基础用法

适用广泛的基础单选

--COMMON

### 可清空

包含清空按钮，可将选择器清空为初始状态

--CLEARABLE

### 基础多选

适用性较广的基础多选，用 `Tag` 展示已选项

--MULTIPLE

### 禁用状态

选择器不可用状态

--DISABLED

### 控制回填内容

--LABELFIELD

### 无数据

--NODATA

--CODE

## SelectCascader Props

| 属性                  | 说明                                                                                                                                                                    | 类型                                      | 默认值                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------- |
| appendToContainer     | 弹窗内容是否添加到指定的 DOM 元素                                                                                                                                       | boolean                                   | `true`                |
| clearable             | 是否显示清除按钮                                                                                                                                                        | boolean                                   | `false`               |
| disabled              | 是否禁用                                                                                                                                                                | boolean                                   | `false`               |
| collapseTags          | 多选时选中项是否折叠展示                                                                                                                                                | boolean                                   | `false`               |
| collapseTagsLimit     | 多选时选中项超出限制个数后才会折叠                                                                                                                                      | number                                    | 1                     |
| emptyText             | 选项为空时显示的文字，也可以使用#empty 设置                                                                                                                             | string                                    | `无数据`              |
| getContainer          | 指定下拉选项挂载的 HTML 节点                                                                                                                                            | () => HTMLElement                         | `() => document.body` |
| multiple              | 是否多选                                                                                                                                                                | boolean                                   | `false`               |
| multipleLimit         | 多选时用户最多可以选择的项目数，为 0 则不限制                                                                                                                           | number                                    | `0`                   |
| placeholder           | 当没有选择内容时的提示语                                                                                                                                                | string                                    | -                     |
| modelValue / v-model  | 选中的值                                                                                                                                                                | number / string / boolean / object        | -                     |
| data                  | 展示数据                                                                                                                                                                | Array\<CascaderOption\>                   | `[]`                  |
| expandedKeys(v-model) | 展开的节点的 key 的数组                                                                                                                                                 | Array<string \| number>                   | `[]`                  |
| cascade               | `checkable` 状态下节点选择完全受控（父子节点选中状态关联）                                                                                                              | boolean                                   | `false`               |
| checkStrictly         | 设置勾选策略来指定勾选回调返回的值，`all` 表示回调函数值为全部选中节点；`parent` 表示回调函数值为父节点（当父节点下所有子节点都选中时）；`child` 表示回调函数值为子节点 | string                                    | `all`                 |
| childrenField         | 替代 `CascaderOption` 中的 `children` 字段名                                                                                                                            | string                                    | `children`            |
| valueField            | 替代 `CascaderOption` 中的 `value` 字段名                                                                                                                               | string                                    | `value`               |
| labelField            | 替代 `CascaderOption` 中的 `label` 字段名                                                                                                                               | string                                    | `label`               |
| remote                | 是否异步获取选项，和 `onLoad` 配合                                                                                                                                      | boolean                                   | `false`               |
| loadData              | 异步加载数据的回调函数                                                                                                                                                  | (node: CascaderOption) => Promise\<void\> | `null`                |
| expandTrigger         | 次级菜单的展开方式，可选值为`click`,`hover`                                                                                                                             | string                                    | `click`               |

## SelectCascader Events

| 事件名称      | 说明                                                                         | 回调参数                      |
| ------------- | ---------------------------------------------------------------------------- | ----------------------------- |
| change        | 选中的值发生变化                                                             | 目前选中的值                  |
| visibleChange | 下拉框出现/隐藏时触发                                                        | 出现则为 true，隐藏则为 false |
| removeTag     | 取消选中时调用，参数为选中项的 value (或 key) 值，仅在 `multiple` 模式下生效 | 取消选中的值                  |
| blur          | 当选择器失去焦点时触发                                                       | event                         |
| focus         | 当选择器获得焦点时触发                                                       | event                         |
| clear         | 点击清除按钮时触发                                                           | event                         |

## SelectCascader Methods

| 名称  | 说明     |
| ----- | -------- |
| blur  | 取消焦点 |
| focus | 获取焦点 |

## SelectCascader Slots

| 名称 | 说明                                           | 参数                                                 |
| ---- | ---------------------------------------------- | ---------------------------------------------------- |
| tag  | 控制标签的渲染，自定义选中选项在选择框如何展示 | _{ option: CascaderOption, handleClose: ()=> void }_ |

## CascaderOption props

| 属性        | 说明                                                   | 类型                        | 默认值  |
| ----------- | ------------------------------------------------------ | --------------------------- | ------- |
| value       | 节点的 `key`，需要唯一，可使用 `valueField` 修改字段名 | string / number             | `-`     |
| label       | 节点的内容，可使用 `labelField` 修改字段名             | string                      | `-`     |
| children?   | 节点的子节点                                           | CascaderOption[]            | `[]`    |
| disabled?   | 是否禁用节点， 默认为`Cascader`组件的`disabled`        | boolean                     | `-`     |
| selectable? | 是否禁用选中节点，默认为`Cascader`组件的`selectable`   | boolean                     | `-`     |
| checkable?  | 是否禁用勾选节点，默认为`Cascader`组件的`checkable`    | boolean                     | `-`     |
| isLeaf?     | 节点是否是叶节点，在 remote 模式下是必须的             | boolean                     | `false` |
| prefix?     | 节点的前缀                                             | string / (() => VNodeChild) | `null`  |
| suffix?     | 节点的后缀                                             | string / (() => VNodeChild) | `null`  |
