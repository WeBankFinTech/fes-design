# Card 卡片

卡片主要用于对信息进行模块分类。或将零散的信息聚合到一起使其成为一个整体。

## 组件注册

```js
import { FCard } from '@fesjs/fes-design';

app.use(FCard);
```

## 代码演示

### 基础用法

:::demo
basic.vue
:::

### 投影效果

:::demo
shadow.vue
:::

### 设置大小

:::demo
size.vue
:::

### 是否显示边框

:::demo
bordered.vue
:::

### 是否有标题

:::demo
hasHeader.vue
:::

### 是否有分割线

:::demo
divider.vue
:::

### 自定义标题

:::demo
customHeader.vue
:::

### 自定义底栏

:::demo
customFooter.vue
:::

### 自定义内容

:::demo
customContent.vue
:::

## Card Props

| 属性      | 说明                                                                               | 类型                    | 默认值   |
|-----------|----------------------------------------------------------------------------------|-------------------------|----------|
| header    | 卡片的标题 你既可以通过设置 header 来修改标题，也可以通过 slot#header 传入 DOM 节点 | string                  | -        |
| divider   | 若有 header，则是否显示分割线                                                       | boolean                 | `true`   |
| bodyStyle | body 的 CSS 样式                                                                   | object\<CSSProperties\> | -        |
| shadow    | 设置阴影显示时机，可选值为 `always` `never` `hover`                                 | string                  | `always` |
| bordered  | 是否有边框                                                                         | boolean                 | `true`   |
| size      | 设置卡片大小，可选值为 `small` `middle` `large`                                     | string                  | `middle` |

## Card Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |
| header  | 卡片标题内容   |
| footer  | 卡片底栏内容   |
