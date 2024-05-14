# Link 链接

文字超链接

## 组件注册

```js
import { FLink } from '@fesjs/fes-design';

app.use(FLink);
```

## 代码演示

### 基础用法

:::demo
base.vue
:::

### 跳转
通过设置`target`，设定跳转行为，同原生a标签的`target`属性  
若`href`不设置，则点击不会发生任何跳转

:::demo
href.vue
:::

### 图标
提供了图标的插槽

:::demo
icon.vue
:::

## Props
| 属性      | 说明                                                           | 类型      | 默认值    |
| --------- | -------------------------------------------------------------- | --------- | --------- |
| size      | 尺寸大小，可选`small`，`middle`，`large`                       | `string`  | `middle`  |
| type      | 类型，可选`default`，`primary`，`success`，`danger`，`warning` | `string`  | `default` |
| underline | 展示下划线                                                     | `boolean` | `true`    |
| disabled  | 是否禁用                                                       | `boolean` | `false`   |
| href      | 跳转链接                                                       | `string`  | `-`       |
| target    | 跳转行为，同原生target                                         | `string`  | `-`       |

## Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 链接内容 | `-`  |
| icon    | 图标     | `-`  |