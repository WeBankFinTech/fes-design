# Anchor 锚点

快速跳转到页面中指定锚点位置。

## 组件注册

```js
import { FAnchor } from '@fesjs/fes-design';

app.use(FAnchor);
```

## 代码演示

### 基础用法

通过 `links` 属性传入锚点链接列表，组件会渲染对应的导航菜单，点击链接会跳转到页面中对应的 `href` 位置。

:::demo
common.vue
:::

### 子链接

`links` 中的每一项都支持 `children` 字段，用于配置二级导航。点击一级链接展开子链接，点击子链接跳转到对应位置。

:::demo
withChildren.vue
:::

### 自定义容器

通过 `container` 属性指定滚动容器（默认为 `document.documentElement`）。`offsetTop` 可以控制跳转时距离容器顶部的偏移量（常用于避免被 fixed 头部遮挡）。

:::demo
customContainer.vue
:::

## Anchor Props

| 属性           | 说明                                  | 类型             | 默认值 |
| -------------- | ------------------------------------- | ---------------- | ------ |
| links          | 锚点链接列表，详见下方 `AnchorLink`   | `AnchorLink[]`   | `[]`   |
| container      | 指定滚动容器                          | `HTMLElement`    | —      |
| currentAnchor  | 当前激活的锚点                        | `string`         | `''`   |
| offsetTop      | 锚点跳转时距离容器顶部的偏移量（px） | `number`         | `0`    |

## AnchorLink

| 属性     | 说明     | 类型           | 默认值 |
| -------- | -------- | -------------- | ------ |
| title    | 链接标题 | `string`       | —      |
| href     | 锚点地址 | `string`       | —      |
| children | 子链接   | `AnchorLink[]` | —      |

## Anchor Events

| 事件名称 | 说明                          | 回调参数                              |
| -------- | ----------------------------- | ------------------------------------- |
| click    | 点击锚点链接时触发            | `(e: MouseEvent, href: string) => void` |
| change   | 当前激活的锚点发生变化时触发  | `(href: string) => void`              |
