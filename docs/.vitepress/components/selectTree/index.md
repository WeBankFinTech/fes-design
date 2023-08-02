# SelectTree 树形选择器

用于展示树形数据，并且提供选择功能。

## 组件注册

```js
import { FSelectTree } from '@fesjs/fes-design';

app.use(FSelectTree);
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

### 可搜索

可以利用搜索功能快速查找选项

--FILTERABLE

### 禁用状态

选择器不可用状态

--DISABLED

### 虚拟列表

设置`virtualList`属性，处理大数据。
--VIRTUALLIST

### 控制回填内容

--LABELFIELD

### 无数据

--NODATA

### 获取选中路径

--WITHPATH

--CODE

## SelectTree Props

| 属性                  | 说明                                                                                                                                                                    | 类型                                             | 默认值                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------- |
| appendToContainer     | 弹窗内容是否添加到指定的 DOM 元素                                                                                                                                       | boolean                                          | `true`                |
| clearable             | 是否显示清除按钮                                                                                                                                                        | boolean                                          | `false`               |
| disabled              | 是否禁用                                                                                                                                                                | boolean                                          | `false`               |
| collapseTags          | 多选时选中项是否折叠展示                                                                                                                                                | boolean                                          | `false`               |
| collapseTagsLimit     | 多选时选中项超出限制个数后才会折叠                                                                                                                                      | number                                           | 1                     |
| tagBordered           | 多选时，选中项展示是否有边框（disabled 为 true 时强制有边框）                                                                                                           | boolean                                          | `false`               |
| emptyText             | 选项为空时显示的文字，也可以使用#empty 设置                                                                                                                             | string                                           | `无数据`              |
| getContainer          | 指定下拉选项挂载的 HTML 节点                                                                                                                                            | () => HTMLElement                                | `() => document.body` |
| multiple              | 是否多选                                                                                                                                                                | boolean                                          | `false`               |
| multipleLimit         | 多选时用户最多可以选择的项目数，为 0 则不限制                                                                                                                           | number                                           | `0`                   |
| placeholder           | 当没有选择内容时的提示语                                                                                                                                                | string                                           | -                     |
| modelValue / v-model  | 选中的值                                                                                                                                                                | number / string / array                          | -                     |
| filterable            | 是否支持过滤选项                                                                                                                                                        | boolean                                          | `false`               |
| filter                | 自定义过滤函数                                                                                                                                                          | (pattern: string, option: TreeOption) => boolean | `-`                   |
| data                  | 展示数据                                                                                                                                                                | Array\<TreeOption\>                              | `[]`                  |
| accordion             | 手风琴模式，是否保持同级节点中只有一个节点展开                                                                                                                          | boolean                                          | `false`               |
| defaultExpandAll      | 是否默认展开所有节点，当有 `expandedKeys` 时，`defaultExpandAll` 将失效                                                                                                 | boolean                                          | `false`               |
| expandedKeys(v-model) | 展开的节点的 key 的数组                                                                                                                                                 | Array\<string \| number>                         | `[]`                  |
| cascade               | `checkable` 状态下节点选择完全受控（父子节点选中状态关联）                                                                                                              | boolean                                          | `false`               |
| checkStrictly         | 设置勾选策略来指定勾选回调返回的值，`all` 表示回调函数值为全部选中节点；`parent` 表示回调函数值为父节点（当父节点下所有子节点都选中时）；`child` 表示回调函数值为子节点 | string                                           | `all`                 |
| childrenField         | 替代 `TreeOption` 中的 `children` 字段名                                                                                                                                | string                                           | `children`            |
| valueField            | 替代 `TreeOption` 中的 `value` 字段名                                                                                                                                   | string                                           | `value`               |
| labelField            | 替代 `TreeOption` 中的 `label` 字段名                                                                                                                                   | string                                           | `label`               |
| remote                | 是否异步获取选项，和 `loadData` 配合                                                                                                                                    | boolean                                          | `false`               |
| loadData              | 异步加载数据的回调函数                                                                                                                                                  | (node: TreeOption) => Promise\<void\>            | `null`                |
| inline                | 底层节点是否横向排列                                                                                                                                                    | boolean                                          | `false`               |
| virtualList           | 是否使用虚拟滚动，inline 需要为 false                                                                                                                                   | boolean                                          | `false`               |
| emitPath              | `modelValue` 是否返回选中节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值。                                                                         | boolean                                          | `false`               |
| showPath              | 是否在选择器中显示选项路径                                                                                                                                              | boolean                                          | `false`               |

## SelectTree Events

| 事件名称      | 说明                                                                         | 回调参数                      |
| ------------- | ---------------------------------------------------------------------------- | ----------------------------- |
| change        | 选中的值发生变化                                                             | 目前选中的值                  |
| visibleChange | 下拉框出现/隐藏时触发                                                        | 出现则为 true，隐藏则为 false |
| removeTag     | 取消选中时调用，参数为选中项的 value (或 key) 值，仅在 `multiple` 模式下生效 | 取消选中的值                  |
| blur          | 当选择器失去焦点时触发                                                       | event                         |
| focus         | 当选择器获得焦点时触发                                                       | event                         |
| clear         | 点击清除按钮时触发                                                           | event                         |

## SelectTree Methods

| 名称  | 说明     |
| ----- | -------- |
| blur  | 取消焦点 |
| focus | 获取焦点 |

## SelectTree Slots

| 名称 | 说明                                           | 参数                                             |
| ---- | ---------------------------------------------- | ------------------------------------------------ |
| tag  | 控制标签的渲染，自定义选中选项在选择框如何展示 | _{ option: TreeOption, handleClose: ()=> void }_ |

## TreeOption props

| 属性        | 说明                                                   | 类型                        | 默认值  |
| ----------- | ------------------------------------------------------ | --------------------------- | ------- |
| value       | 节点的 `key`，需要唯一，可使用 `valueField` 修改字段名 | string / number             | `-`     |
| label       | 节点的内容，可使用 `labelField` 修改字段名             | string                      | `-`     |
| children?   | 节点的子节点                                           | TreeOption[]                | `[]`    |
| disabled?   | 是否禁用节点， 默认为`Tree`组件的`disabled`            | boolean                     | `-`     |
| selectable? | 是否禁用选中节点，默认为`Tree`组件的`selectable`       | boolean                     | `-`     |
| checkable?  | 是否禁用勾选节点，默认为`Tree`组件的`checkable`        | boolean                     | `-`     |
| isLeaf?     | 节点是否是叶节点，在 remote 模式下是必须的             | boolean                     | `false` |
| prefix?     | 节点的前缀                                             | string / (() => VNodeChild) | `null`  |
| suffix?     | 节点的后缀                                             | string / (() => VNodeChild) | `null`  |
