# Drawer 抽屉

主要用于当前页面的操作结果需要承载的内容较多的场景使用抽屉组件，逻辑和 Modal 类似

## 组件注册

```js
import { FDrawer } from '@fesjs/fes-design';

app.use(FDrawer);
```

## 代码演示

### 基础用法

:::demo
common.vue
:::

### 位置

自定义位置，点击触发按钮抽屉从相应的位置滑出，点击遮罩区关闭，默认是 right

:::demo
placement.vue
:::

### 拖拽

可设置宽度或者高度可拖拽，默认 resizable 是 false

:::demo
resizable.vue
:::

### 自定义头部

通过 slot `title`可以自定义页脚内容

:::demo
customTitle.vue
:::

### 自定义页脚

通过 slot `footer`可以自定义页脚内容

:::demo
customFooter.vue
:::

### 异步提交

针对抽屉确认提交操作。

:::demo
asyncSubmit.vue
:::

### 交互

仅 mask 为 false 时生效，不显示蒙层时，页面是否可交互

:::demo
operable.vue
:::

## Drawer Props

| 属性             | 说明                                                                        | 类型                                    | 默认值                |
|------------------|---------------------------------------------------------------------------|-----------------------------------------|-----------------------|
| show             | v-model:show，是否显示抽屉                                                   | boolean                                 | `false`               |
| displayDirective | 选择渲染使用的指令，if 对应 v-if，show 对应 v-show，使用 show 的时候不会被重置 | string                                  | `show`                |
| closable         | 是否显示右上角关闭图标                                                      | boolean                                 | `true`                |
| mask             | 是否显示蒙层                                                                | boolean                                 | `true`                |
| maskClosable     | 点击蒙层是否允许关闭                                                        | boolean                                 | `true`                |
| operable         | 仅 mask 为 false 时生效，不显示蒙层时，页面是否可交互                         | boolean                                 | `false`               |
| title            | 标题                                                                        | string                                  | -                     |
| footer           | 是否显示底部内容                                                            | boolean                                 | `false`               |
| footerBorder     | 是否显示底部分割线                                                          | boolean                                 | `false`               |
| okText           | 确认按钮文字                                                                | string                                  | 确定                  |
| okLoading        | 确认按钮 Loading 状态                                                       | boolean                                 | `false`               |
| showCancel       | 是否展示取消按钮                                                            | boolean                                 | `true`                |
| cancelText       | 取消按钮文字                                                                | string                                  | 取消                  |
| width            | 宽度                                                                        | string/number                           | 520                   |
| hight            | 高度，在 placement 为 top 或 bottom 时使用                                   | string/number                           | 520                   |
| placement        | 抽屉方向                                                                    | `'right'` `'bottom'` `'left'` `'right'` | `'right'`             |
| contentClass     | 可用于设置内容的类名                                                        | string                                  | -                     |
| getContainer     | 指定 `Drawer` 挂载的 HTML 节点                                              | () => HTMLElement                       | `() => document.body` |
| resizable        | 是否支持宽度/高度可拖拽                                                     | boolean                                 | `false`               |
| resizeMax        | 可拖拽的最大尺寸（如：`100`、`'200px'`、`'30%'`）                                | number/string                           | -                     |
| resizeMin        | 可拖拽的最小尺寸（同上）                                                      | number/string                           | -                     |

## Drawer Event

| 事件名称 | 说明                                 | 回调参数 |
|----------|------------------------------------|----------|
| cancel   | 点击遮罩层或右上角叉或取消按钮的回调 | event    |
| ok       | 点击确定回调                         | event    |

## Drawer Slots

| 名称    | 说明                      |
|---------|-------------------------|
| default | 模态框的内容              |
| title   | 模态框的标题              |
| footer  | 底部内容，一般是自定义按钮 |
