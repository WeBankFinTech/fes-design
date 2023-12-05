# Input 输入框

通过鼠标或键盘输入内容。

## 组件注册

```js
import { FInput } from '@fesjs/fes-design';

app.use(FInput);
```

## 代码演示

### 基础用法

:::demo
common.vue
:::

### 复合型输入框

:::demo
append.vue
:::

### 可清除输入框

:::demo
clearable.vue
:::

### disabled

:::demo
disabled.vue
:::

### 显示输入数字

:::demo
number.vue
:::

### 密码输入框

:::demo
password.vue
:::

### 自定义前缀/后缀

:::demo
prefixSuffix.vue
:::

### 文本域

:::demo
textarea.vue
:::

### 事件监听

:::demo
event.vue
:::

### 聚焦和失焦

:::demo
autofocus.vue
:::

## Props

| 属性          | 说明                                                                                       | 类型            | 默认值  |
| ------------- | ------------------------------------------------------------------------------------------ | --------------- | ------- |
| autocomplete  | 原生属性，自动补全                                                                         | string          | -       |
| clearable     | 可以点击清除图标删除内容，仅`type`非`textarea`时有效                                       | boolean         | `false` |
| disabled      | 是否禁用                                                                                   | boolean         | `false` |
| maxlength     | 最大长度                                                                                   | number          | -       |
| placeholder   | placeholder                                                                                | string          | -       |
| type          | `textarea`为文本域，非`textarea`时声明`input`类型，同原生`input`标签的`type`属性           | string          | `text`  |
| modelValue    | v-model 双向绑定                                                                           | number、string  | -       |
| resize        | 是否允许用户缩放，可选值： `none` `both` `horizontal` `vertical`                           | string          | -       |
| rows          | 输入框行数，只在 `type="textarea"` 时有效                                                  | number          | 2       |
| showWordLimit | 是否显示输入数字统计，只在 `type="textarea"` 时有效                                        | boolean         | false   |
| showPassword  | 是否显示切换密码图标，仅`type`非`textarea`时有效                                           | boolean         | false   |
| autosize      | 自适应内容高度，只在 `type="textarea"` 时有效，可输入对象，入 `{ minRows: 2, maxRows: 3 }` | boolean、object | false   |

## Slots

| 属性    | 说明                                |
| ------- | ----------------------------------- |
| prefix  | 前缀，只在 `type="text"` 时有效     |
| suffix  | 后缀，只在 `type="text"` 时有效     |
| prepend | 前置内容，只在 `type="text"` 时有效 |
| append  | 前置内容，只在 `type="text"` 时有效 |

## Events

| 事件名称 | 说明                                                                  | 回调参数        |
| -------- | --------------------------------------------------------------------- | --------------- |
| change   | 仅在输入框失去焦点或用户按下回车时触发                                | (event) => void |
| input    | 内容变更触发                                                          | (event) => void |
| blur     | 失去焦点                                                              | (event) => void |
| focus    | 获取焦点                                                              | (event) => void |
| clear    | 点击 `clearable` 属性生成的清空按钮时触发，仅`type`非`textarea`时有效 | -               |
| keydown  | 按下键盘时触发                                                        | (event) => void |

## Methods

| 名称  | 说明     |
| ----- | -------- |
| blur  | 取消焦点 |
| focus | 获取焦点 |
