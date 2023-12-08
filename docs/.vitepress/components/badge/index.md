# Badge 徽标

用于展示数字和自定义标识

## 组件注册

```js
import { FBadge } from '@fesjs/fes-design';

app.use(FBadge);
```

## 代码演示

### 基础用法
展示数值，小红点展示

:::demo
base.vue
:::

### 自定义颜色

指定颜色或者色号，默认为红色

:::demo
color.vue
:::

### 自定义内容

通过插槽指定徽标内容

:::demo
customContent.vue
:::

### 设定阈值

超出阈值展示阈值+，默认阈值99

:::demo
overflowCount.vue
:::

### 尺寸大小

可设定两种尺寸，默认和small

:::demo
size.vue
:::

### 小红点的应用

:::demo
dot.vue
:::

### 单独使用

:::demo
alone.vue
:::

## Props

| 属性          | 说明          | 类型               | 默认值    |
| ------------- | ------------- | ------------------ | --------- |
| count         | 徽标内容      | `number \| number` | `0`       |
| color         | 徽标颜色      | `string`           | `#FF4D4F` |
| dot           | 红点模式      | `boolean`          | `false`   |
| showZero      | 值为0是否展示 | `boolean`          | `false`   |
| overflowCount | 设定封顶阈值  | `number`           | `99`      |
| size          | 尺寸          | `default \| small` | `default` |