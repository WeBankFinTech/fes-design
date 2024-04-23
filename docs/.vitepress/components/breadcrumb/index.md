# Breadcrumb 面包屑

显示当前页面的路径，快速返回之前的任意页面。

## 组件注册

```js
import { FBreadcrumb, FBreadcrumbItem } from '@fesjs/fes-design';

app.use(FBreadcrumb);
app.use(FBreadcrumbItem);
```

## 代码演示

### 基础用法

:::demo
base.vue
:::

### 自定义点击事件
自定义某个item的点击事件。
同时点击行为，也可以和 vue-router 一起结合使用。

:::demo
click.vue
:::

## Breadcrumb Props

| 属性      | 说明              | 类型     | 默认值 |
| --------- | ----------------- | -------- | ------ |
| separator | 分隔符，默认为`/` | `string` | `-`    |
| fontSize  | 字体大小          | `number` | `14`   |

## Breadcrumb Slots

| 名称    | 说明                |
| ------- | ------------------- |
| default | BreadcrumbItem 组件 |

## BreadcrumbItem Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 用户自定义内容 |
