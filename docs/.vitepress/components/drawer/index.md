# Drawer 抽屉

主要用于当前页面的操作结果需要承载的内容较多的场景使用抽屉组件，逻辑和 Modal 类似

## 组件注册

```js
import { FDrawer } from '@fesjs/fes-design';

app.use(FDrawer);
```

## 代码演示

### 基础用法

--COMMON

### 位置

自定义位置，点击触发按钮抽屉从相应的位置滑出，点击遮罩区关闭，默认是 right

--PLACEMENT

### 拖拽

可设置宽度或者高度可拖拽，默认 resizable 是 false

--RESIZABLE

--CODE

## Drawer Props

| 属性             | 说明                                                                           | 类型              | 默认值                                  |
| ---------------- | ------------------------------------------------------------------------------ | ----------------- | --------------------------------------- |
| show             | v-model:show，是否显示抽屉                                                     | Boolean           | `false`                                 |
| displayDirective | 选择渲染使用的指令，if 对应 v-if，show 对应 v-show，使用 show 的时候不会被重置 | string            | `show`                                  |
| closable         | 是否显示右上角关闭图标                                                         | Boolean           | `true`                                  |
| mask             | 是否显示蒙层                                                                   | Boolean           | `true`                                  |
| maskClosable     | 点击蒙层是否允许关闭                                                           | Boolean           | `true`                                  |
| title            | 标题                                                                           | String            | -                                       |
| footer           | 是否显示底部内容                                                               | Boolean           | `false`                                 |
| okText           | 确认按钮文字                                                                   | String            | 确定                                    |
| cancelText       | 取消按钮文字                                                                   | String            | 取消                                    |
| width            | 宽度                                                                           | String/Number     | 520                                     |
| hight            | 高度， 高度, 在 placement 为 top 或 bottom 时使用                              | String/Number     | 520                                     |
| placement        | 抽屉方向                                                                       | 'right'             | 'right' 、'bottom' 、 'left' 、 'right' |
| contentClass     | 可用于设置内容的类名                                                           | String            | -                                       |
| getContainer     | 指定 `Drawer` 挂载的 HTML 节点                                                 | () => HTMLElement | `() => document.body`                   |
| resizable        | 是否支持宽度/高度可拖拽                                                        | Boolean           | `false`                                 |

## Drawer Event

| 事件名称 | 说明                                 | 回调参数 |
| -------- | ------------------------------------ | -------- |
| cancel   | 点击遮罩层或右上角叉或取消按钮的回调 | event    |
| ok       | 点击确定回调                         | event    |

## Drawer Slots

| 名称    | 说明                       |
| ------- | -------------------------- |
| default | 模态框的内容               |
| title   | 模态框的标题               |
| footer  | 底部内容，一般是自定义按钮 |
