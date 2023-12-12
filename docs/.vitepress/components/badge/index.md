# Badge 徽标

用于展示数字和自定义标识

## 组件注册

```js
import { FBadge } from '@fesjs/fes-design';

app.use(FBadge);
```

## 代码演示

### 基础用法
展示数值，小红点展示，默认情况下数值0不展示

:::demo
base.vue
:::

### 类型
根据类型展示对应类型的颜色徽标

:::demo
type.vue
:::

### 自定义颜色

不仅通过类型可以设定颜色，也可以自定义颜色

:::demo
color.vue
:::

### 自定义内容

通过插槽指定徽标内容

:::demo
customContent.vue
:::

### 控制显示/隐藏

:::demo
visible.vue
:::

### 设定阈值

超出阈值展示阈值+，默认阈值99，只有在value是number的情况下，才会生效

:::demo
max.vue
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

## 组件Props

| 属性     | 说明                                          | 类型                                              | 默认值    |
| -------- | --------------------------------------------- | ------------------------------------------------- | --------- |
| value    | 徽标内容                                      | `number \| number`                                | `-`       |
| color    | 徽标颜色                                      | `string`                                          | `#FF4D4F` |
| isDot    | 红点模式                                      | `boolean`                                         | `false`   |
| hidden   | 是否隐藏                                      | `boolean`                                         | `false`   |
| showZero | 值为0是否展示                                 | `boolean`                                         | `false`   |
| max      | 设定封顶阈值，只有value是number情况下才会生效 | `number`                                          | `99`      |
| size     | 尺寸                                          | `middle \| small`                                 | `middle`  |
| type     | 徽标类型                                      | `primary \| success \| danger \| warning` | `danger`  |