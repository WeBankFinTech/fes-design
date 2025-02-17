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

:::demo
common.vue
:::

### 配置方式

通过配置 `options` 直接生成选项性能更优，推荐用配置 `options` 直接生成选项！

:::demo
options.vue
:::

### 虚拟滚动

配置 `virtualScroll` 属性来开启虚拟滚动。默认当数据量大于 `50` 时使用 `VirtualList` 组件实现虚拟列表，也可以自定义。

:::demo
virtualScroll.vue
:::

### 基础多选

适用性较广的基础多选，用 `Tag` 展示已选项

:::demo
multiple.vue
:::

### 限制多选个数

当选择达到上限时无法再继续选择新的

:::demo
limit.vue
:::

### 自定义选项模板

可以自定义备选项模板，`FOption`子组件是针对每一项单独配置，而 `slots.option` 插槽则是通用配置。

:::demo
customOption.vue
:::

### 自定义回填内容

:::demo
customTag.vue
:::

### 可过滤

可以利用搜索功能快速查找选项

:::demo
filterable.vue
:::

### 动态创建选项

使用 `tag` & `filterable` 来允许动态创建选项。

:::demo
tag.vue
:::

### 远程搜索

:::demo
remote.vue
:::

### 禁用选项

禁止选择某一项

:::demo
optionDisabled.vue
:::

### 禁用选择器

选择器不可用状态

:::demo
disabled.vue
:::

### 可清空

包含清空按钮，可将选择器清空为初始状态

:::demo
clearable.vue
:::

### 无数据

:::demo
nodata.vue
:::

### 顶部、底部插槽

如果你点开了这个例子，可能你需要它

:::demo
addon.vue
:::

### 选项组

选项组配置，支持 options 配置和插槽使用

:::demo
selectGroupOption.vue
:::

## Select Props

| 属性                 | 说明                                                          | 类型                                         | 默认值                |
| -------------------- | ------------------------------------------------------------- | -------------------------------------------- | --------------------- |
| appendToContainer    | 弹窗内容是否添加到指定的 DOM 元素                             | boolean                                      | `true`                |
| clearable            | 是否显示清除按钮                                              | boolean                                      | `false`               |
| disabled             | 是否禁用                                                      | boolean                                      | `false`               |
| collapseTags         | 多选时选中项是否折叠展示                                      | boolean                                      | `false`               |
| collapseTagsLimit    | 多选时选中项超出限制个数后才会折叠                            | number                                       | 1                     |
| tagBordered          | 多选时，选中项展示是否有边框（disabled 为 true 时强制有边框） | boolean                                      | `false`               |
| emptyText            | 选项为空时显示的文字，也可以使用#empty 设置                   | string                                       | `无数据`              |
| getContainer         | 指定下拉选项挂载的 HTML 节点                                  | () => HTMLElement                            | `() => document.body` |
| multiple             | 是否多选                                                      | boolean                                      | `false`               |
| multipleLimit        | 多选时用户最多可以选择的项目数，为 0 则不限制                 | number                                       | `0`                   |
| placeholder          | 当没有选择内容时的提示语                                      | string                                       | -                     |
| modelValue / v-model | 选中的值                                                      | number / string / boolean / object           | -                     |
| filterable           | 是否支持过滤选项                                              | boolean                                      | `false`               |
| filter               | 自定义过滤函数                                                | (pattern: string, option: object) => boolean | `-`                   |
| filterTextHighlight  | 过滤文本是否高亮                                              | boolean                                      | `false`               |
| tag                  | 是否可以创建新的选项，需要和 `filterable` 一起使用            | boolean                                      | `false`               |
| remote               | 是否远程搜索，当输入内容时触发`search`事件                    | boolean                                      | `false`               |
| options              | 选项配置                                                      | array\<SelectOption\>                        | `[]`                  |
| virtualScroll        | 虚拟滚动                                                      | boolean / number                             | `true`                |
| valueField           | 替代 `SelectOption` 中的 `value` 字段名                       | string                                       | `value`               |
| labelField           | 替代 `SelectOption` 中的 `label` 字段名                       | string                                       | `label`               |
| popperClass          | 弹出框容器样式                                                | string                                       | -                     |
| triggerClass         | 弹出框触发器样式类                                            | string                                       | -                     |
| triggerStyle         | 弹出框触发器样式                                              | string / object                              | -                     |

## Select Events

| 事件名称      | 说明                                                                         | 回调参数                   |
| ------------- | ---------------------------------------------------------------------------- | -------------------------- |
| change        | 选择或者清除选中选项时触发                                                   | (value) => void            |
| visibleChange | 下拉框出现/隐藏时触发, 出现则为 true，隐藏则为 false                         | (visible: Boolean) => void |
| removeTag     | 取消选中时调用，参数为选中项的 value (或 key) 值，仅在 `multiple` 模式下生效 | 取消选中的值               |
| blur          | 当选择器失去焦点时触发                                                       | (event: Event) => void     |
| focus         | 当选择器获得焦点时触发                                                       | (event: Event) => void     |
| clear         | 点击清除按钮时触发                                                           | (event: Event) => void     |
| scroll        | 滚动事件                                                                     | (event: Event) => void     |
| search        | 搜索事件                                                                     | ( query: String) => void   |
| filter        | 过滤事件                                                                     | ( query: String) => void   |

## Select Slots

| 名称    | 说明                                           | 参数                                               |
| ------- | ---------------------------------------------- | -------------------------------------------------- |
| default | option 和 selectGroupOption 组件列表           | -                                                  |
| empty   | 无选项的内容                                   | -                                                  |
| option  | 自定义 `Option` 内容                           | _{ value, label, disabled, isSelected }_           |
| tag     | 控制标签的渲染，自定义选中选项在选择框如何展示 | _{ option: SelectOption, handleClose: ()=> void }_ |
| header  | 弹框顶部显示自定义的内容                       | -                                                  |
| footer  | 弹框底部显示自定义的内容                       | -                                                  |
| addon   | 即将废弃，请使用 footer                        | -                                                  |

## Select Methods

| 名称  | 说明     |
| ----- | -------- |
| blur  | 取消焦点 |
| focus | 获取焦点 |

## Option Props

| 属性     | 说明                                      | 类型                               | 默认值  |
| -------- | ----------------------------------------- | ---------------------------------- | ------- |
| value    | 选项的值，需要唯一                        | string / number / boolean / object | -       |
| label    | 选项的标签，若不设置则默认与 `value` 相同 | string / number                    | -       |
| disabled | 是否禁用                                  | boolean                            | `false` |

## SelectGroupOption Props

| 属性     | 说明                         | 类型    | 默认值  |
| -------- | ---------------------------- | ------- | ------- |
| label    | 选项组标签                   | string  | -       |
| disabled | 选项组禁用，子选项都不可选择 | boolean | `false` |

## SelectGroupOption Slots

| 属性  | 说明                                    |
| ----- | --------------------------------------- |
| label | 自定义分组标签，优先级比 props.label 高 |

## SelectOption

| 属性     | 说明                             | 类型                               |
| -------- | -------------------------------- | ---------------------------------- |
| value    | 非分组选项的值，需要唯一         | string / number / boolean / object |
| label    | 选项的标签                       | string / number                    |
| disabled | 是否禁用                         | boolean                            |
| children | 若为数组类型，则当前项为分组选项 | `Array<SelectOption>`              |
