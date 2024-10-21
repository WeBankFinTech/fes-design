# Popper 弹出信息

在内容周围弹出一些隐藏的信息。内置样式，需要自行定制。
如果你只想展示一些基本的文本内容，推荐使用 `Tooltip`。

## 组件注册

```js
import { FPopper } from '@fesjs/fes-design';

app.use(FPopper);
```

## 代码演示

### 基础用法

属性 `trigger` 设置触发方式，`hover`、`click`、`focus`。

:::demo
common.vue
:::

### 是否显示

:::demo
visible.vue
:::

### 受控模式

:::demo
passive.vue
:::

## Popper Props

| 属性              | 说明                                                                                                                                                  | 类型                      | 默认值                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | --------------------- |
| v-model           | 手动控制显示                                                                                                                                          | boolean                   | `false`               |
| placement         | 出现的位置，可选值有`top` `top-start` `top-end` `bottom` `bottom-start` `bottom-end` `right` `right-start` `right-end` `left` `left-start` `left-end` | string                    | `auto`                |
| trigger           | 触发类型`hover` `click` `focus`, confirm 模式下只能是`click`                                                                                          | string                    | `hover`               |
| disabled          | 是否可用                                                                                                                                              | boolean                   | `false`               |
| offset            | 出现位置的偏移量                                                                                                                                      | number                    | `6`                   |
| arrow             | 是否显示箭头                                                                                                                                          | boolean                   | `true`                |
| appendToContainer | 弹窗内容是否添加到指定的 DOM 元素                                                                                                                     | boolean                   | `true`                |
| popperClass       | 弹出框的样式类名                                                                                                                                      | string \| object \| Array | -                     |
| popperStyle       | 弹出框的样式                                                                                                                                          | object                    | -                     |
| showAfter         | 显示的延迟时间                                                                                                                                        | number                    | `0`                   |
| passive           | 是否受控模式，true-非受控，false-受控                                                                                                                 | boolean                   | `true`                |
| hideAfter         | 隐藏的延迟时间                                                                                                                                        | number                    | `0`                   |
| lazy              | 是否懒渲染                                                                                                                                            | boolean                   | `true`                |
| getContainer      | 配置渲染节点的输出位置                                                                                                                                | () => HTMLElement         | `() => document.body` |

## Popper Events

| 事件名称     | 说明               | 回调参数   |
| ------------ | ------------------ | ---------- |
| clickOutside | 是否点击了外部区域 | () => void |

## Popper Methods

| 方法名称   | 说明       | 参数    |
| ---------- | ---------- | ------- |
| updatePopperPosition | 更新弹出层位置 | () => void |

## Popper Slots

| 名称    | 说明               |
| ------- | ------------------ |
| trigger | 触发提示包裹的内容 |
| default | 提示内容           |
