# Radio 单选框

## 组件注册

```js
import { FRadio, FRadioGroup, FRadioButton } from '@fesjs/fes-design';

app.use(FRadio);
app.use(FRadioGroup);
app.use(FRadioButton);
```

## 代码演示

### 基础用法

单独使用可以表示两种状态之间的切换，写在标签中的内容为 `radio` 按钮后的介绍。

--COMMON

### 组合用法

适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。

--GROUP

#### 垂直方向

--VERTICAL

#### 按钮组

单选按钮组，可通过`size`设置按钮组整体大小，对于单个按钮可以通过`disabled` 设置是否禁用。  
按钮样式分为两种，可以通过`type`进行设置。  
按钮组分为有边框和无边框两种，可以通过进行`bordered`设置。

--BUTTON

#### 配置方式

通过配置`options`直接生成选项,可以通过`optionType`设置生成项的类型

--OPTIONS

--CODE

## Radio Props

| 属性     | 说明                                       | 类型                      | 默认值  |
| -------- | ------------------------------------------ | ------------------------- | ------- |
| disabled | 是否禁用                                   | boolean                   | `false` |
| label    | 描述和介绍                                 | string                    | `null`  |
| v-model  | 绑定值                                     | boolean                   | `false` |
| value    | 选中状态的值（搭配 RadioGroup 使用时有效） | string / number / boolean | `null`  |

## Radio Events

| 事件名称 | 说明                     | 回调参数   |
| -------- | ------------------------ | ---------- |
| change   | 当绑定值变化时触发的事件 | 更新后的值 |

## Radio Slots

| 名称    | 说明                                  |
| ------- | ------------------------------------- |
| default | 描述和介绍。相比 label，slot 优先使用 |

## RadioGroup Props

| 属性       | 说明                                                  | 类型                        | 默认值    |
| ---------- | ----------------------------------------------------- | --------------------------- | --------- |
| disabled   | 是否禁用                                              | boolean                     | `false`   |
| v-model    | 绑定值                                                | string \| number \| boolean | `-`       |
| vertical   | 是否垂直排列（默认水平排列）                          | boolean                     | `false`   |
| cancelable | 选中后是否可取消                                      | boolean                     | `true`    |
| options    | 选项配置                                              | array\<Option\>             | `[]`      |
| valueField | 替代 `Option` 中的 `value` 字段名                     | string                      | `value`   |
| labelField | 替代 `Option` 中的 `label` 字段名                     | string                      | `label`   |
| optionType | 用于设置 Radio options 类型 可选值 `default` `button` | string                      | `default` |
| type       | 按钮样式类型 可选值 `default` `primary`               | string                      | `default` |
| size       | 按钮大小 可选值 `small` `middle`                      | string                      | `middle`  |
| bordered   | 按钮是否含有边框                                      | boolean                     | `true`    |
| fullLine   | 是否撑满整个父容器宽度                                | boolean                     | `false`   |

## RadioButton Props

| 属性     | 说明                                                 | 类型                      | 默认值  |
| -------- | ---------------------------------------------------- | ------------------------- | ------- |
| disabled | 是否禁用                                             | boolean                   | `false` |
| label    | 按钮描述和介绍                                       | string                    | `null`  |
| v-model  | 按钮选定状态 双向绑定                                | boolean                   | `false` |
| value    | 选中状态的值，RadioButton 需在 RadioGroup 标签内使用 | string / number / boolean | `null`  |

## RadioGroup Events

| 事件名称 | 说明                     | 回调参数   |
| -------- | ------------------------ | ---------- |
| change   | 当绑定值变化时触发的事件 | 更新后的值 |

## RadioGroup Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | Radio 组件 |

## Option Props

| 属性     | 说明       | 类型                      | 默认值  |
| -------- | ---------- | ------------------------- | ------- |
| value    | 选项的值   | string / number / boolean | -       |
| label    | 选项的标签 | string / number           | -       |
| disabled | 是否禁用   | boolean                   | `false` |
