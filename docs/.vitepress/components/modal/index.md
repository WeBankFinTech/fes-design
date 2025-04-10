# Modal 模态框

模态框通常以模态形式出现，因此叫模态框，例如像对话框、弹窗等都属于模态框，主要引导用户进行相关操作。

## 组件注册

```js
import { FModal } from '@fesjs/fes-design';

app.use(FModal);
```

## 代码演示

### 基础用法

:::demo
common.vue
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

### 全局方法 - 确认对话框

使用 `confirm()` 可以快捷地弹出确认框。

:::demo
confirm.vue
:::

### 全局方法 - 信息反馈

各种类型的信息提示

:::demo
feedback.vue
:::

### 异步提交

针对弹窗确认提交操作。

:::demo
asyncSubmit.vue
:::

### 是否展示取消按钮

:::demo
showCancel.vue
:::

### 最大弹窗高度

`maxHeight`默认不设置，如果实际弹窗的`height`高于`maxHeight`，以`maxHeight`为准，弹窗内容滚动。

:::demo
maxHeight.vue
:::

### 关闭弹窗

通过配置项可以控制弹窗的关闭方式。

:::demo
closable.vue
:::

## Modal Props

| 属性             | 说明                                                                           | 类型              | 默认值                |
| ---------------- | ------------------------------------------------------------------------------ | ----------------- | --------------------- |
| show             | v-model:show，是否显示模态框                                                   | Boolean           | `false`               |
| displayDirective | 选择渲染使用的指令，if 对应 v-if，show 对应 v-show，使用 show 的时候不会被重置 | string            | `show`                |
| closable         | 是否显示右上角关闭图标                                                         | Boolean           | `true`                |
| mask             | 是否显示蒙层                                                                   | Boolean           | `true`                |
| maskClosable     | 点击蒙层是否允许关闭                                                           | Boolean           | `true`                |
| escClosable      | 按下 ESC 是否允许关闭                                                          | boolean           | `true`                |
| type             | 类型，可选值为`info` `success` `error` `warning` `warn` `confirm`              | string            | `-`                   |
| title            | 标题                                                                           | String            | `-`                   |
| footer           | 是否显示底部内容                                                               | Boolean           | `true`                |
| okText           | 确认按钮文字                                                                   | String            | 确定                  |
| okLoading        | 确认按钮 Loading 状态                                                          | Boolean           | `false`               |
| showCancel       | 是否展示取消按钮                                                               | Boolean           | `true`                |
| cancelText       | 取消按钮文字                                                                   | String            | 取消                  |
| width            | 宽度                                                                           | String/Number     | 520                   |
| maxHeight        | 最大弹窗高度，如果实际高度大于 maxHeight，内容滚动                             | String/Number     | `-`                   |
| top              | 距离顶部                                                                       | String/Number     | 50                    |
| bottom           | 距离底部，为了防止弹窗底部贴边，可自定义                                       | String/Number     | 50                    |
| verticalCenter   | 垂直居中                                                                       | Boolean           | `false`               |
| center           | 标题、内容、按钮居中                                                           | Boolean           | `false`               |
| fullScreen       | 全屏显示                                                                       | Boolean           | `false`               |
| contentClass     | 可用于设置内容的类名                                                           | String            | `-`                   |
| wrapperClass     | 可用于设置组件根类名                                                           | String            | `-`                   |
| useAnimation     | 是否使用动画                                                                   | Boolean           | `true`                |
| getContainer     | 指定 `Modal` 挂载的 HTML 节点                                                  | () => HTMLElement | `() => document.body` |

## Modal Event

| 事件名称   | 说明                                 | 回调参数 |
| ---------- | ------------------------------------ | -------- |
| cancel     | 点击遮罩层或右上角叉或取消按钮的回调 | event    |
| ok         | 点击确定回调                         | event    |
| afterEnter | Modal 出现后的回调                   | event    |
| afterLeave | Modal 关闭后的回调                   | event    |

## Modal Slots

| 名称    | 说明                       |
| ------- | -------------------------- |
| default | 模态框的内容               |
| title   | 模态框的标题               |
| footer  | 底部内容，一般是自定义按钮 |

## 全局方法

-   `Modal.config(options)` 全局方法的默认配置

-   `Modal.info(options)`

-   `Modal.success(options)`

-   `Modal.error(options)`

-   `Modal.warning(options)`

-   `Modal.warn(options)` 同 warning

-   `Modal.confirm(options)`

参数如下：

| 参数           | 说明                                               | 类型                       | 默认值                                       |
| -------------- | -------------------------------------------------- | -------------------------- | -------------------------------------------- |
| closable       | 是否显示右上角关闭图标                             | Boolean                    | false                                        |
| mask           | 是否显示蒙层                                       | Boolean                    | true                                         |
| maskClosable   | 点击蒙层是否允许关闭                               | Boolean                    | false                                        |
| title          | 标题                                               | string / vNode / ()=>VNode |
| content        | 内容                                               | string / vNode / ()=>VNode | -                                            |
| okText         | 确认按钮文字                                       | String                     | 确定                                         |
| okLoading      | 确认按钮 Loading 状态                              | Boolean                    | `false`                                      |
| showCancel     | 是否展示取消按钮                                   | Boolean                    | confim 方法默认`true`，其他方法默认为`false` |
| cancelText     | 取消按钮文字                                       | String                     | 取消                                         |
| cancelLoading  | 取消按钮 Loading 状态                              | Boolean                    | `false`                                      |
| onOk           | 点击确定                                           | Function                   | -                                            |
| onCancel       | 点击遮罩层或右上角叉或取消按钮的回调               | Function                   | -                                            |
| width          | 宽度                                               | String/Number              | 400                                          |
| maxHeight      | 最大内容高度，如果实际高度大于 maxHeight，内容滚动 | String/Number              | `-`                                          |
| top            | 距离顶部                                           | String/Number              | 50                                           |
| verticalCenter | 垂直居中                                           | Boolean                    | false                                        |
| center         | 标题、内容、按钮居中                               | Boolean                    | false                                        |
| fullScreen     | 全屏显示                                           | Boolean                    | `false`                                      |
| contentClass   | 可用于设置内容的类名                               | String                     | -                                            |
| wrapperClass   | 可用于设置组件根类名                               | String                     | `-`                                          |
| useAnimation   | 是否使用动画                                       | Boolean                    | `true`                                       |
| getContainer   | 指定 `Modal` 挂载的 HTML 节点                      | () => HTMLElement          | `() => document.body`                        |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

```js
const modal = Modal.info();

modal.update({
    title: '修改的标题',
    content: '修改的内容',
});

modal.destroy();
```
