# Empty 空数据

空数据时的占位提示。

## 组件注册

```js
import { FEmpty } from '@fesjs/fes-design';

app.use(FEmpty);
```

## 代码演示

### 基础用法

:::demo
default.vue
:::

### 自定义图片(属性)

通过属性自定义图片。

:::demo
customImageAttr.vue
:::

### 自定义图片(插槽)

通过插槽自定义图片。

:::demo
customImageSlot.vue
:::

### 下拉选项场景

在其他组件中的应用。

:::demo
select.vue
:::

### 自定义底部内容

:::demo
bottom.vue
:::

## API

### 属性 Attributes

| 属性名      | 描述                                  | 类型            | 默认值 |
| ----------- | ------------------------------------- | --------------- | ------ |
| imageSrc    | 图像地址，优先级小于 solt | `string`        | -      |
| imageStyle  | 图像自定义样式            | `CSSProperties` | -      |
| description | 描述信息，优先级小于 solt | `string`        | -      |

### 插槽 Slots

| 插槽名称    | 描述               |
| ----------- | ------------------ |
| default     | 作为底部内容的内容 |
| image       | 作为图像的内容     |
| description | 作为描述的内容     |
