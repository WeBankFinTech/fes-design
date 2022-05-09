# TimePicker 时间选择

时间选择组件

## 组件注册

```js
import { FTimePicker } from '@fesjs/fes-design';

app.use(FTimePicker);
```

## 代码演示

### 基础用法

--COMMON

### 自定义下方控制区域

--ADDON

### 不带确定按钮

--CONTROL

### 禁用

--DISABLED

### 格式

--FORMAT

--CODE

## Props

| 属性              | 说明                                                     | 类型                                                      | 默认值                |
| ----------------- | -------------------------------------------------------- | --------------------------------------------------------- | --------------------- |
| modelValue        | 日期的值，可以使用 v-model 实现数据的双向绑定            | string                                                    | -                     |
| open              | 面版是否打开，可以使用 v-model:open 实现数据的双向绑定   | boolean                                                   | `false`               |
| appendToContainer | 弹窗内容是否添加到指定的 DOM 元素                        | boolean                                                   | `true`                |
| disabled          | 禁用                                                     | boolean                                                   | `false`               |
| clearable         | 是否展示清除按钮                                         | boolean                                                   | `true`                |
| placeholder       | 占位内容，数组仅用于范围选择时自定义开始和结束的占位内容 | string                                                    | -                     |
| format            | 时间格式                                                 | string                                                    | `HH:mm:ss`            |
| hourStep          | 小时选项间隔                                             | number                                                    | `1`                   |
| minuteStep        | 分钟选项间隔                                             | number                                                    | `1`                   |
| secondStep        | 秒钟选项间隔                                             | number                                                    | `1`                   |
| disabledHours     | 禁止选择部分小时选项                                     | (hour: number) => boolean                                 | -                     |
| disabledMinutes   | 禁止选择部分分钟选项                                     | (hour: number, minute: number) => boolean                 | -                     |
| disabledSeconds   | 禁止选择部分秒钟选项                                     | (hour: number, minute: number, second: number) => boolean | -                     |
| control           | 是否显示下方控制区域                                     | boolean                                                   | true                  |
| getContainer      | 指定下拉选项挂载的 HTML 节点                             | () => HTMLElement                                         | `() => document.body` |

## Slots

| 属性  | 说明                       |
| ----- | -------------------------- |
| addon | 选择框底部显示自定义的内容 |

## Events

| 事件名称 | 说明                   | 回调参数   |
| -------- | ---------------------- | ---------- |
| change   | 用户确认选定的值时触发 | 组件绑定值 |
| blur     | 失去焦点时触发         | 事件       |
| focus    | 获取焦点时触发         | 事件       |
