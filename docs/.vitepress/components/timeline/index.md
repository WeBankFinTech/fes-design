# Timeline 时间轴

通过不同的配置，实现不同效果的时间轴。

## 组件注册

```js
import { FTimeline } from '@fesjs/fes-design';

app.use(FTimeline);
```

## 代码演示

### 基础用法

:::demo
basic.vue
:::

### 时间轴方向

通过 `direction` 属性，支持垂直、水平不同方向（不支持水平逆方向）

值同 flex 布局中的 [`flex-direction`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-direction) 属性

-   `column` 轴垂直向下
-   `row` 轴水平向右
-   `row` 轴水平向左

:::demo
direction.vue
:::

### 标题位置

使用 `titlePosition` 调整结点在时间轴两侧的位置

可选值中的 `start` 和 `end`，与 flex 布局中概念相同。可以理解成时间轴为 flex 中的「主轴」，结点相对时间轴的位置，则是「交叉轴」。例如：

-   `start` 表示书写方向的开始，如：`direction: row` 时，`start` 为纵轴的上方
-   `end` 表示书写方向的末尾，如：`direction: column` 时，`end` 为横轴的右侧

:::demo
titlePosition.vue
:::

### 辅助描述位置

用于设置辅助描述相对于标题的位置

-   `under` 辅助说明位于标题下方
-   `inline` 辅助说明与标题同行
-   `opposite` 辅助说明和标题分别于轴两侧

_当轴为水平方向时，不支持辅助说明与标题同行_

:::demo
descPosition.vue
:::

### 自定义辅助描述

:::demo
customDesc.vue
:::

### 轴点-自定义颜色

支持预设的 `info`、`success`、`error`、`warning`，此外还可以使用如 `#ff007f` 这样的能被 CSS 的 `color` 接受的颜色值

:::demo
customIconColor.vue
:::

### 轴点-自定义图标

:::demo
customIcon.vue
:::

## Props

| 属性          | 说明               | 类型                         | 默认值   |
| ------------- | ------------------ | ---------------------------- | -------- |
| data          | 数据               | `TimelineNode[]`             | -        |
| direction     | 时间轴方向         | `column` `row` `row-reverse` | `column` |
| titlePosition | 标题位置           | `start` `end` `alternate`    | `end`    |
| descPosition  | 辅助说明位置       | `under` `inline` `opposite`  | `under`  |
| titleClass    | 自定义标题样式     | `string`                     | -        |
| descClass     | 自定义辅助说明样式 | `string`                     | -        |

#### TimelineNode

| 属性          | 说明                   | 类型                                                                                              | 默认值 |
| ------------- | ---------------------- | ------------------------------------------------------------------------------------------------- | ------ |
| title         | 轴结点的标题           | `string`                                                                                          | -      |
| titlePosition | 轴结点的标题位置       | `start` `end`                                                                                     | -      |
| desc          | 轴结点的辅助说明       | `string` `({ index: number }) => VNode`                                                           | -      |
| icon          | 轴结点的轴点图标自定义 | `info` `success` `error` `warning`<br/> `CSSProperties.color`<br/> `({ index: number }) => VNode` | -      |

## Slots

| 名称 | 说明     | 参数  |
| ---- | -------- | ----- |
| desc | 辅助说明 | index |
| icon | 轴点图标 | index |
