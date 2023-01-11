# DatePicker 日期选择

日期选择

## 组件注册

```js
import { DatePicker } from '@fesjs/fes-design';

app.use(DatePicker);
```

## 代码演示

### 基础功能

--common

### 范围选择

--rangeSelect

### 日期多选

--multiple

### 禁用部分日期

--someDisabled

### 禁用

--disabled

### 快捷选项

--shortcuts

### 带确定按钮

--control

--CODE

## Props

### 通用 Props

| 属性         | 说明                                                                                   | 类型                                                                                                             | 默认值  |
| ------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| modelValue   | 日期值，支持 v-model 双向绑定                                                          | Array/Number                                                                                                     | -       |
| disabledDate | 禁止日期函数，参数为对应的时间 Date，执行结果为 true 则禁止                            | (date: Date)=> Boolean                                                                                           | -       |
| disabledTime | 禁止时间选择, 返回参数同 time-picker 的 disableHours, disabledMinutes, disabledSeconds | (date: Date) => ({disabledHours: () => Boolean, disabledMinutes: () => Boolean, disabledSeconds: () => Boolean}) | -       |
| type         | 类型                                                                                   | `date` `datetime` `datemultiple` `daterange` `datetimerange` `datemonthrange` `year` `month` `quarter`           | `date`  |
| maxDate      | 最大可选择时间                                                                         | Date                                                                                                             | -       |
| minDate      | 最小可选择时间                                                                         | Date                                                                                                             | -       |
| maxRange     | 最大可选区间，格式为 /\d+[D]/                                                          | string                                                                                                           | -       |
| control      | 是否显示确认按钮，在多选强制为 true，其他情况默认为 false                              | boolean                                                                                                          | `false` |
| hourStep     | 小时选项间隔                                                                           | number                                                                                                           | `1`     |
| minuteStep   | 分钟选项间隔                                                                           | number                                                                                                           | `1`     |
| secondStep   | 秒钟选项间隔                                                                           | number                                                                                                           | `1`     |
| defaultTime  | 选中日期后默认具体时刻，非时间范围 string；时间范围 string[]，格式: '12:00:00'         | string/string[]                                                                                                  | -       |

### DatePicker 类型 Props

| 属性              | 说明                                                                                                                     | 类型              | 默认值                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------- | --------------------- |
| placeholder       | 占位内容，数组为选择日期范围时使用                                                                                       | string/Array      | -                     |
| clearable         | 是否显示清除按钮                                                                                                         | boolean           | `true`                |
| format            | 展示格式，具体配置可查[format](https://date-fns.org/v2.28.0/docs/format)，根据不同的 type 类型，会有不同的默认展示格式。 | string            | -                     |
| disabled          | 禁用                                                                                                                     | boolean           | `false`               |
| popperClass       | 弹窗样式                                                                                                                 | string            | -                     |
| appendToContainer | 弹窗内容是否添加到指定的 DOM 元素                                                                                        | boolean           | `true`                |
| getContainer      | 指定下拉选项挂载的 HTML 节点                                                                                             | () => HTMLElement | `() => document.body` |

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
