# SelectCascader 级联选择器

当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

## 组件注册

```js
import { FSelectCascader } from '@fesjs/fes-design';

app.use(FSelectCascader);
```

## 代码演示

### 基础用法

适用广泛的基础单选。

--COMMON

### 可清空

包含清空按钮，可将选择器清空为初始状态。

--CLEARABLE

### 基础多选

适用性较广的基础多选，用 `Tag` 展示已选项。

--MULTIPLE

### emitPath 返回节点菜单路径

适用于异步加载初始化展示等场景。

--EMITPATH

### 异步加载

若需要自动加载节点展示，则需要 `emitPath` 置为 `true`。

--ASYNC

### 禁用状态

选择器不可用状态。

--DISABLED

### 自定义选项及控制回填内容

--CUSTOM

### 无数据

--NODATA

--CODE

## SelectCascader Props

| 属性                  | 说明                                                                                                                                                                                                                      | 类型                                                          | 默认值                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------- |
| modelValue / v-model  | 选中的值                                                                                                                                                                                                                  | number / string / boolean / object                            | -                     |
| data                  | 展示数据                                                                                                                                                                                                                  | Array\<CascaderOption\>                                       | `[]`                  |
| appendToContainer     | 弹窗内容是否添加到指定的 DOM 元素                                                                                                                                                                                         | boolean                                                       | `true`                |
| clearable             | 是否显示清除按钮                                                                                                                                                                                                          | boolean                                                       | `false`               |
| disabled              | 是否禁用                                                                                                                                                                                                                  | boolean                                                       | `false`               |
| collapseTags          | 多选时选中项是否折叠展示                                                                                                                                                                                                  | boolean                                                       | `false`               |
| collapseTagsLimit     | 多选时选中项超出限制个数后才会折叠                                                                                                                                                                                        | number                                                        | `1`                   |
| tagBordered           | 多选时，选中项展示是否有边框（disabled 为 true 时强制有边框）                                                                                                                                                             | boolean                                                       | `false`               |
| emptyText             | 选项为空时显示的文字，也可以使用#empty 设置                                                                                                                                                                               | string                                                        | `无数据`              |
| getContainer          | 指定下拉选项挂载的 HTML 节点                                                                                                                                                                                              | () => HTMLElement                                             | `() => document.body` |
| multiple              | 是否多选                                                                                                                                                                                                                  | boolean                                                       | `false`               |
| placeholder           | 当没有选择内容时的提示语                                                                                                                                                                                                  | string                                                        | -                     |
| expandedKeys(v-model) | 展开的节点的 key 的数组                                                                                                                                                                                                   | Array\<string \| number>                                      | `[]`                  |
| cascade               | `checkable` 状态下节点选择完全受控（父子节点选中状态关联）                                                                                                                                                                | boolean                                                       | `false`               |
| checkStrictly         | 设置勾选策略来指定勾选回调返回的值。多选时，`all` 表示回调函数值为全部选中节点；`parent` 表示回调函数值为父节点（当父节点下所有子节点都选中时）；`child` 表示回调函数值为子节点。单选时，`all` 表示回调函数值可为父节点。 | string                                                        | `child`               |
| childrenField         | 替代 `CascaderOption` 中的 `children` 字段名                                                                                                                                                                              | string                                                        | `children`            |
| valueField            | 替代 `CascaderOption` 中的 `value` 字段名                                                                                                                                                                                 | string                                                        | `value`               |
| labelField            | 替代 `CascaderOption` 中的 `label` 字段名                                                                                                                                                                                 | string                                                        | `label`               |
| remote                | 是否异步获取选项，和 `loadData` 配合                                                                                                                                                                                      | boolean                                                       | `false`               |
| loadData              | 异步加载数据的回调函数                                                                                                                                                                                                    | (node: null \| CascaderOption) => Promise\<CascaderOption[]\> | -                     |
| expandTrigger         | 次级菜单的展开方式，可选值为`click`,`hover`                                                                                                                                                                               | string                                                        | `click`               |
| emitPath              | `modelValue` 是否返回选中节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值。                                                                                                                           | boolean                                                       | `false`               |
| showPath              | 是否在选择器中显示选项路径                                                                                                                                                                                                | boolean                                                       | `false`               |

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

| 名称 | 说明                                           | 参数                                               |
| ---- | ---------------------------------------------- | -------------------------------------------------- |
| tag  | 控制标签的渲染，自定义选中选项在选择框如何展示 | _{ option: CascaderNode, handleClose: ()=> void }_ |

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

## CascaderNode props

| 属性  | 说明                                                 | 类型                                                | 默认值 |
| ----- | ---------------------------------------------------- | --------------------------------------------------- | ------ |
| value | 同 `CascaderOption` 中的 `value` 字段                | string / number                                     | `-`    |
| label | 同 `CascaderOption` 中的 `label` 字段                | string                                              | `-`    |
| path  | 节点所在的各级菜单的 `value` 和 `label` 所组成的数组 | `Array<{ value: string \| number, label: string }>` | `[]`   |
