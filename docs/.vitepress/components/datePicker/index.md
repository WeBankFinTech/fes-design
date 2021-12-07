# DatePicker 日期选择

日期选择

## 组件注册

```js
import { DatePicker } from 'wedesign';

app.use(DatePicker);
```

## 代码演示

### 基础功能

--common

### 范围选择

--rangeSelect

### 禁用部分日期

--someDisabled

### 禁用

--disabled

### 带确定按钮

--control

--CODE

## Props

### 通用 Props

| 属性         | 说明                                                                                   | 类型                                                                                                             | 默认值    |
| ------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------- |
| modelValue   | 日期值，支持 v-model 双向绑定                                                          | Date/Array/Number                                                                                                | -         |
| disabledDate | 禁止日期函数，参数为对应的时间 Date，执行结果为 true 则禁止                            | (date: Date)=> Boolean                                                                                           | -         |
| disabledTime | 禁止时间选择, 返回参数同 time-picker 的 disableHours, disabledMinutes, disabledSeconds | (date: Date) => ({disabledHours: () => Boolean, disabledMinutes: () => Boolean, disabledSeconds: () => Boolean}) | -         |
| type         | 类型                                                                                   | `date` `datetime` `daterange` `datetimerange` `year` `month`                                                     | `quarter` |
| maxDate      | 最大可选择时间                                                                         | Date                                                                                                             | -         |
| minDate      | 最小可选择时间                                                                         | Date                                                                                                             | -         |
| maxRange     | 最大可选区间，格式为 /\d+[DMY]/                                                        | string                                                                                                           | -         |
| control      | 是否显示确认按钮，在多选强制为 true，其他情况默认为 false                              | boolean                                                                                                          | `false`   |

### DatePicker 类型 Props

| 属性              | 说明                                                                        | 类型              | 默认值                |
| ----------------- | --------------------------------------------------------------------------- | ----------------- | --------------------- |
| placeholder       | 占位内容，数组为选择日期范围时使用                                          | string/Array      | -                     |
| clearable         | 是否显示清除按钮                                                            | boolean           | `true`                |
| format            | 日期格式：YYYY-MM-DD HH:mm:ss，根据不同的 type 类型，会有不同的默认展示格式 | string            | -                     |
| disabled          | 禁用                                                                        | boolean           | `false`               |
| open              | 面版是否打开，可以使用 v-model:open 实现数据的双向绑定                      | boolean           | `false`               |
| popperClass       | 弹窗样式                                                                    | string            | -                     |
| appendToContainer | 弹窗内容是否添加到指定的 DOM 元素                                           | boolean           | `true`                |
| getContainer      | 指定下拉选项挂载的 HTML 节点                                                | () => HTMLElement | `() => document.body` |

## Slots

| slot 名称  | 说明                   |
| ---------- | ---------------------- |
| suffixIcon | 输入框左边的 icon      |
| separator  | 时间范围选择的分割符号 |

## Events

| 事件名称 | 说明                    | 回调参数   |
| -------- | ----------------------- | ---------- |
| change   | 用户确认选定的值时触发  | 组件绑定值 |
| clear    | 用户点击清除按钮        | 组件绑定值 |
| blur     | 当 input 失去焦点时触发 | 组件实例   |
| focus    | 当 input 获取焦点时触发 | 组件实例   |
