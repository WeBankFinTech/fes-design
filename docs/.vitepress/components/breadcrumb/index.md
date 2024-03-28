# Breadcrumb 面包屑

显示当前页面的路径，快速返回之前的任意页面。

## 组件注册

```js
import { FBreadcrumb } from '@fesjs/fes-design';

app.use(FBreadcrumb);
```

## 代码演示

### 基础用法

:::demo
base.vue
:::

### 点击跳转
配置to属性，指定跳转的路由。  
replace属性默认为false，开启true，跳转行为将不会留下历史记录。

:::demo
to.vue
:::

### menu菜单
可以配置面包屑的子菜单，跳转行为保持一致。

:::demo
menu.vue
:::

## Breadcrumb Props

| 属性      | 说明              | 类型      | 默认值  |
| --------- | ----------------- | --------- | ------- |
| separator | 分隔符，默认为`/` | `string`  | `-`     |
| fontSize  | 字体大小          | `number`  | `14`    |
| icon      | 是否展示icon      | `boolean` | `false` |

## BreadcrumbItem Props

| 属性    | 说明                      | 类型          | 默认值  |
| ------- | ------------------------- | ------------- | ------- |
| replace | 跳转行为，是否开启replace | `boolean`     | `false` |
| to      | 前往的路由                | `string`      | `-`     |
| menu    | 子菜单数据                | `Array<Menu>` | `[]`    |

## Menu
| 属性 | 说明       | 类型     | 默认值 |
| ---- | ---------- | -------- | ------ |
| name | 子菜单名称 | `string` | `-`    |
| path | 前往的路由 | `string` | `-`    |