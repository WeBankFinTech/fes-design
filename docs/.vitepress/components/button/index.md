# Button 按钮

可点击按钮。

## 组件注册

```js
import { FButton } from '@fesjs/fes-design';

app.use(FButton);
```

## 代码演示

### 基础用法

:::demo
basic.vue
:::

### Icon 按钮

:::demo
icon.vue
:::

### long 按钮

:::demo
long.vue
:::

## Props

| 属性     | 说明                                                                               | 类型    | 默认值    |
| -------- | ---------------------------------------------------------------------------------- | ------- | --------- |
| disabled | 按钮禁用状态                                                                       | boolean | `false`   |
| size     | 按钮大小，可选值 `small` `middle` `large`                                          | string  | `middle`  |
| htmlType | 设置 `button` 的原生 `type` 值，可选值请参考 HTML 标准                             | string  | `button`  |
| loading  | 按钮加载状态                                                                       | boolean | `false`   |
| long     | 按钮按钮宽度为父元素宽度                                                           | boolean | `false`   |
| throttle | 节流                                                                               | number  | `300`     |
| type     | 设置按钮类型，可选值为 `primary` `text` `link` `info` `success` `warning` `danger` | string  | `default` |
| iconPlacement     | icon位置，可选值为 `left` `right` | string  | `left` |

## Slots

| slot 名称 | 说明     |
| --------- | -------- |
| icon      | 按钮图标 |

## Events

| 事件名称 | 说明         | 回调参数        |
| -------- | ------------ | --------------- |
| click    | 按钮点击事件 | (event) => void |
