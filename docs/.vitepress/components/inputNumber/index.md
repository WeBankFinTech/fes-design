# inputNumber 数字输入框

通过鼠标或者键盘输入内容，仅能输入数字。

## 组件注册

```js
import { FInputNumber } from '@fesjs/fes-design';

app.use(FInputNumber);
```

## 代码演示

### 标准使用

--COMMON

### 禁用状态

--DISABLED

### 设置最大值最小值

设定最大值为 10，最小值为 1

--MAXANDMIN

### 设置精度

设置精度为 2

--PRECISION

### 设置步长

设置步长为 5，最大值为 12,精度为 2

--STEP

### 设置前置后置

--prefixSuffix

--CODE

## Props

| 属性        | 说明             | 类型    | 默认值      |
| :---------- | :--------------- | :------ | :---------- |
| modelValue  | v-model 双向绑定 | number  | -           |
| min         | 计数器最小值     | number  | `-infinity` |
| max         | 计数器最大值     | number  | `infinity`  |
| step        | 计数器步长       | number  | `1`         |
| disabled    | 是否禁用         | boolean | `false`     |
| placeholder | 输入框默认提示   | string  | -           |
| precision   | 数值精度         | number  | -           |

## Slots

| 属性   | 说明 |
| ------ | ---- |
| prefix | 前缀 |
| suffix | 后缀 |

## Events

| 事件名称 | 说明                        | 回调参数               |
| :------- | :-------------------------- | :--------------------- |
| change   | 绑定值被改变时触发          | currentValue, oldValue |
| blur     | 在组件 Input 失去焦点时触发 | (event: Event)         |
| focus    | 在组件 Input 获得焦点时触发 | (event: Event)         |
