# Cascader 级联选择器

当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

## 组件注册

```js
import { FCascader } from 'fes-design';

app.use(FCascader);
```

## 代码演示

### 基础用法（默认单选）

--COMMON

### 基础多选

--MULTIPLE

### 空选项

--EMPTY

### 自定义节点内容

--CUSTOMNODE

### 禁用状态

--DISABLED

--CODE

## Cascader Props

| 参数                 | 说明                                            | 类型                | 默认值                |
| -------------------- | ----------------------------------------------- | ------------------- | --------------------- |
| modelValue / v-model | 选中项绑定值                                    | -                   | -                     |
| options              | 可选项数据源，键名可通过 nodeConfig 属性配置    | Array\<NodeOption\> | -                     |
| nodeConfig           | 菜单选择配置选项，具体见下表 `NodeConfig Props` | object              | -                     |
| placeholder          | 输入框占位文本                                  | string              | `请选择`              |
| disabled             | 是否禁用                                        | boolean             | `false`               |
| clearable            | 是否支持清空选项                                | boolean             | `false`               |
| collapseTags         | 多选时选中项是否折叠展示                        | boolean             | `false`               |
| multiple             | 是否多选                                        | boolean             | `false`               |
| showAllLevels        | 输入框中是否显示选中值的完整路径                | boolean             | `true`                |
| separator            | 选项分隔符                                      | string              | `/`                   |
| appendToContainer    | 弹窗内容是否添加到指定的 DOM 元素               | boolean             | `true`                |
| getContainer         | 指定下拉选项挂载的 HTML 节点                    | () => HTMLElement   | `() => document.body` |

## Cascader Events

| 事件名称      | 说明                          | 回调参数                      |
| ------------- | ----------------------------- | ----------------------------- |
| change        | 当选中节点变化时触发          | 选中节点的值                  |
| expandChange  | 当展开节点发生变化时触发      | 各父级选项值组成的数组        |
| clear         | 清除值的时候触发              | (event: Event)                |
| visibleChange | 下拉框出现/隐藏时触发         | 出现则为 true，隐藏则为 false |
| removeTag     | 在多选模式下，移除 Tag 时触发 | 移除的 Tag 对应的节点的值     |

## Cascader Methods

| 方法名          | 说明           | 参数                                        |
| --------------- | -------------- | ------------------------------------------- |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |

## Cascader Slots

| 名称    | 说明                                                                            |
| ------- | ------------------------------------------------------------------------------- |
| default | 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据 |

## NodeConfig Props

| 参数          | 说明                                                                                               | 类型    | 默认值     |
| ------------- | -------------------------------------------------------------------------------------------------- | ------- | ---------- |
| expandTrigger | 次级菜单的展开方式，可选值为`click`,`hover`                                                        | string  | `click`    |
| emitPath      | 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值 | boolean | `false`    |
| valueField    | 替代 `NodeOption` 中的 `value` 字段名                                                              | string  | `value`    |
| labelField    | 替代 `NodeOption` 中的 `label` 字段名                                                              | string  | `label`    |
| childrenField | 替代 `NodeOption` 中的 `children` 字段名                                                           | string  | `children` |
| disabledField | 替代 `NodeOption` 中的 `disabled` 字段名                                                           | string  | `disabled` |

## NodeOption Props

| 参数     | 说明                                                   | 类型            | 默认值  |
| -------- | ------------------------------------------------------ | --------------- | ------- |
| value    | 节点的 `key`，需要唯一，可使用 `valueField` 修改字段名 | string / number | -       |
| label    | 节点的内容，可使用 `labelField` 修改字段名             | string          | -       |
| children | 节点的子节点，可使用 `childrenField` 修改字段名        | NodeOption[]    | `[]`    |
| disabled | 是否禁用节点，可使用 `disabledField` 修改字段名        | boolean         | `false` |
