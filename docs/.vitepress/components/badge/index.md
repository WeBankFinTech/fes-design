# Badge 徽标

用于展示数字和自定义标识

## 组件注册

```js
import { FBadge } from '@fesjs/fes-design';

app.use(FBadge);
```

## 代码演示

### 基础用法

展示数值，小红点展示，默认情况下数值 0 不展示

:::demo
base.vue
:::

### 设定阈值

超出阈值展示阈值+，只有在 value 是 number 的情况下，才会生效

:::demo
max.vue
:::

### 自定义内容

通过插槽指定徽标内容

:::demo
content.vue
:::

### 自定义背景色

不仅通过类型可以设定默认支持的背景色，也可以自定义背景色

:::demo
backgroundColor.vue
:::

### 单独使用

:::demo
alone.vue
:::

## Props

| 属性            | 说明                                                  | 类型              | 默认值   |
| --------------- | ----------------------------------------------------- | ----------------- | -------- |
| value           | 内容                                                  | `string` `number` | `-`      |
| dot             | 是否红点模式                                          | `boolean`         | `false`  |
| hidden          | 是否隐藏                                              | `boolean`         | `false`  |
| max             | 设定封顶阈值，只有 value 是 number 情况下才会生效     | `number`          | `99`     |
| size            | 尺寸，可选值为 `small` `middle`                       | `string`          | `middle` |
| type            | 类型，可选值为 `primary` `success` `warning` `danger` | `string`          | `danger` |
| backgroundColor | 自定义背景色                                          | `string`          | `-`      |

## Slots

| slot 名称 | 说明           |
| --------- | -------------- |
| content   | 自定义显示内容 |
