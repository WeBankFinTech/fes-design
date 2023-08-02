# Checkbox 复选框

## 组件注册

```js
import { FCheckbox, FCheckboxGroup } from '@fesjs/fes-design';

app.use(FCheckbox);
app.use(FCheckboxGroup);
```

## 代码演示

### 基础用法

单独使用可以表示两种状态之间的切换，写在标签中的内容为 `checkbox` 按钮后的介绍。

--COMMON

### 组合用法

适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。

--GROUP

#### 垂直方向

--VERTICAL

#### 配置方式

通过配置`options`直接生成选项

--OPTIONS

--CODE

## Checkbox Props

| 属性          | 说明                                          | 类型                      | 默认值  |
| ------------- | --------------------------------------------- | ------------------------- | ------- |
| disabled      | 是否禁用                                      | boolean                   | `false` |
| indeterminate | 不确定状态，只负责样式控制                    | boolean                   | `false` |
| label         | 描述和介绍                                    | string                    | `null`  |
| v-model       | 绑定值                                        | boolean                   | `false` |
| value         | 选中状态的值（搭配 CheckboxGroup 使用时有效） | string / number / boolean | `null`  |

## Checkbox Events

| 事件名称 | 说明                     | 回调参数   |
| -------- | ------------------------ | ---------- |
| change   | 当绑定值变化时触发的事件 | 更新后的值 |

## Checkbox Slots

| 名称    | 说明                                  |
| ------- | ------------------------------------- |
| default | 描述和介绍。相比 label，slot 优先使用 |

## CheckboxGroup Props

| 属性       | 说明                              | 类型            | 默认值  |
| ---------- | --------------------------------- | --------------- | ------- |
| disabled   | 是否禁用                          | boolean         | `false` |
| v-model    | 绑定值                            | array           | `null`  |
| vertical   | 是否垂直排列（默认水平排列）      | boolean         | `false` |
| options    | 选项配置                          | array\<Option\> | `[]`    |
| valueField | 替代 `Option` 中的 `value` 字段名 | string          | `value` |
| labelField | 替代 `Option` 中的 `label` 字段名 | string          | `label` |

## CheckboxGroup Events

| 事件名称 | 说明                     | 回调参数   |
| -------- | ------------------------ | ---------- |
| change   | 当绑定值变化时触发的事件 | 更新后的值 |

## CheckboxGroup Slots

| 名称    | 说明          |
| ------- | ------------- |
| default | Checkbox 组件 |

## Option Props

| 属性     | 说明       | 类型                      | 默认值  |
| -------- | ---------- | ------------------------- | ------- |
| value    | 选项的值   | string / number / boolean | -       |
| label    | 选项的标签 | string / number           | -       |
| disabled | 是否禁用   | boolean                   | `false` |
