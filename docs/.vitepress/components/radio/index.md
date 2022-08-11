# Radio 单选框

## 组件注册

```js
import { FRadio, FRadioGroup } from '@fesjs/fes-design';

app.use(FRadio);
app.use(FRadioGroup);
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

| 属性     | 说明                         | 类型    | 默认值  |
| -------- | ---------------------------- | ------- | ------- |
| disabled | 是否禁用                     | boolean | `false` |
| v-model  | 绑定值                       | array   | `null`  |
| vertical | 是否垂直排列（默认水平排列） | boolean | `false` |
| cancelable | 选中后是否可取消 | boolean | `true` |


## RadioGroup Events

| 事件名称 | 说明                     | 回调参数   |
| -------- | ------------------------ | ---------- |
| change   | 当绑定值变化时触发的事件 | 更新后的值 |

## RadioGroup Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | Radio 组件 |
