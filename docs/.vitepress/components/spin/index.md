# Spin 加载中

用于页面和区块的加载中状态。

## 组件注册

```js
import { FSpin } from '@fesjs/fes-design';

app.use(FSpin);
```

## 代码演示

### 基础用法

:::demo
common.vue
:::

### 颜色

:::demo
color.vue
:::

### 卡片加载中

:::demo
loading.vue
:::

### 各种大小

:::demo
size.vue
:::

## Spin Props

| 属性        | 说明                                | 类型    | 默认值   |
|-------------|-----------------------------------|---------|----------|
| size        | 大小，可选有`small`、`middle`、`large` | string  | `middle` |
| description | 描述                                | string  | -        |
| stroke      | 颜色                                | string  | -        |
| show        | 是否显示                            | boolean | `true`   |
| delay       | 延迟显示加载效果的时间, 单位为毫秒<br/>（避免闪烁，如果是反馈交互操作产生的闪烁，是符合预期的）  | number  | `0`      |

## Spin Slots

| 名称        | 说明                             |
|-------------|--------------------------------|
| default     | 如果填入，`Spin` 会包裹填入的内容 |
| icon        | 自定义加载图标                   |
| description | 描述信息                         |
