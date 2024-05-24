# 浮动面板

浮动面板

## 组件注册

```js
import { FFloatPane } from '@fesjs/fes-design';

app.use(FFloatPane);
```

## 代码演示

### 基础用法

:::demo
common.vue
:::

## Props

| 属性             | 说明                                                                           | 类型              | 默认值                         |
| ---------------- | ------------------------------------------------------------------------------ | ----------------- | ------------------------------ |
| visible          | v-model:visible，是否显示浮动面板                                              | Boolean           | `false`                        |
| draggable        | 是否可拖动                                                                     | Boolean           | `true`                         |
| displayDirective | 选择渲染使用的指令，if 对应 v-if，show 对应 v-show，使用 show 的时候不会被重置 | string            | `show`                         |
| title            | 标题                                                                           | String            | `-`                            |
| width            | 宽度                                                                           | String/Number     | 520                            |
| zIndex           | 浮层优先级                                                                     | Number            | 3000                           |
| defaultPosition  | 默认浮动面板位置                                                               | PanePosition      | `{top: '50px', right: '50px'}` |
| cachePosition    | 缓存拖动位置                                                                   | `session` `local` | `local`                        |
| contentClass     | 可用于设置内容的类名                                                           | String            | `-`                            |
| getContainer     | 指定 `FloatPane` 挂载的 HTML 节点                                              | () => HTMLElement | `() => document.body`          |

### PanePosition

```ts
interface PanePosition {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}
```

## Event

| 事件名称   | 说明         | 回调参数 |
| ---------- | ------------ | -------- |
| afterEnter | 出现后的回调 | event    |
| afterLeave | 关闭后的回调 | event    |

## Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 浮动面板的内容 |
| title   | 浮动面板的标题 |
