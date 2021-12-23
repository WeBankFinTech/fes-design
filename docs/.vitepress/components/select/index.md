# Select 下拉菜单

当选项过多时，使用下拉菜单展示并选择内容。

## 组件注册

```js
import { FSelect } from '@fesjs/fes-design';

app.use(FSelect);
```

## 代码演示

### 基础用法

适用广泛的基础单选

--COMMON

### 禁用选项

禁止选择某一项

--OPTIONDISABLED

### 基础多选

适用性较广的基础多选，用 `Tag` 展示已选项

--MULTIPLE

### 限制多选个数

当选择达到上限时无法再继续选择新的

--LIMIT

### 自定义模板

可以自定义备选项模板

--LABEL

### 可搜索

可以利用搜索功能快速查找选项

--FILTERABLE

### 可清空

包含清空按钮，可将选择器清空为初始状态

--CLEARABLE

### 禁用状态

选择器不可用状态

--DISABLED

### 无数据

--NODATA

--CODE

## Select Props

| 属性                 | 说明                                          | 类型                               | 默认值                |
| -------------------- | --------------------------------------------- | ---------------------------------- | --------------------- |
| appendToContainer    | 弹窗内容是否添加到指定的 DOM 元素             | boolean                            | `true`                |
| clearable            | 是否显示清除按钮                              | boolean                            | `false`               |
| disabled             | 是否禁用                                      | boolean                            | `false`               |
| collapseTags         | 多选时选中项是否折叠展示                      | boolean                            | `false`               |
| collapseTagsLimit    | 多选时选中项超出限制个数后才会折叠            | number                             | 1                     |
| emptyText            | 选项为空时显示的文字，也可以使用#empty 设置   | string                             | `无数据`              |
| getContainer         | 指定下拉选项挂载的 HTML 节点                  | () => HTMLElement                  | `() => document.body` |
| multiple             | 是否多选                                      | boolean                            | `false`               |
| multipleLimit        | 多选时用户最多可以选择的项目数，为 0 则不限制 | number                             | `0`                   |
| placeholder          | 当没有选择内容时的提示语                      | string                             | -                     |
| modelValue / v-model | 选中的值                                      | number / string / boolean / object | -                     |
| filterable           | 是否支持过滤选项                              | boolean                            | `false`               |
| remote           | 是否开启远程搜索，配合 search 事件使用                              | boolean                            | `false`               |
| loading           | 数据加载中                              | boolean                            | `false`               |

## Select Events

| 事件名称      | 说明                                                                         | 回调参数                      |
| ------------- | ---------------------------------------------------------------------------- | ----------------------------- |
| change        | 选中的值发生变化                                                             | 目前选中的值                  |
| visibleChange | 下拉框出现/隐藏时触发                                                        | 出现则为 true，隐藏则为 false |
| removeTag     | 取消选中时调用，参数为选中项的 value (或 key) 值，仅在 `multiple` 模式下生效 | 取消选中的值                  |
| blur          | 当 input 失去焦点时触发                                                      | event                         |
| focus         | 当 input 获得焦点时触发                                                      | event                         |
| search         | 输入内容时触发                                                    | event                         |

## Select Slots

| 名称    | 说明            |
| ------- | --------------- |
| default | option 组件列表 |
| empty   | 无选项的内容    |

## Select Methods

| 名称  | 说明     |
| ----- | -------- |
| blur  | 取消焦点 |
| focus | 获取焦点 |

## Option Props

| 属性     | 说明                                      | 类型                               | 默认值  |
| -------- | ----------------------------------------- | ---------------------------------- | ------- |
| value    | 选项的值                                  | string / number / boolean / object | -       |
| label    | 选项的标签，若不设置则默认与 `value` 相同 | string / number                    | -       |
| disabled | 是否禁用                                  | boolean                            | `false` |
