# VirtualList 虚拟列表

当列表的数据量很大时，使用虚拟列表呈现内容。

## 组件注册

```js
import { FVirtualList } from 'fes-design';

app.use(FVirtualList);
```

## 代码演示

### 不规则纵向滚动列表

:::demo
vertical.vue
:::

### 不规则横向滚动列表

:::demo
horizontal.vue
:::

### 最大高度

:::demo
maxHeight.vue
:::

### 滚动操作

:::demo
scroll.vue
:::

### 更多用法

:::demo
more.vue
:::

## VirtualList Props

| 属性            | 说明                                                                                                                                    | 类型                                   | 默认值     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------- |
| dataKey         | 从`dataSources`中的每个数据对象获取唯一键。或者使用每个数据源调用函数并返回其唯一键。其值在数据源中必须是唯一的，用于标识每一项的尺寸。 | string \| (data) => string             | `-`        |
| dataSources     | 为列表生成的源数组，每个数组数据必须是一个对象，并且具有唯一的 key get 或 generate for`data key`属性。                                  | Array\<Object\>                        | `-`        |
| keeps           | 您期望虚拟列表在真实 `dom` 中保持渲染的项目数量。                                                                                       | number                                 | 30         |
| estimateSize    | 每项的估计大小，如果它更接近平均大小，滚动条长度看起来更准确。建议指定自己计算的平均值                                                  | number                                 | 50         |
| start           | 设置滚动位置保持开始索引                                                                                                                | number                                 | 0          |
| offset          | 设置滚动位置保持偏移                                                                                                                    | number                                 | 0          |
| direction       | 滚动的方向, 可选值为 `vertical` 和 `horizontal`                                                                                         | string                                 | `vertical` |
| wrapTag         | 列表包裹元素名称                                                                                                                        | string                                 | `div`      |
| wrapClass       | 列表包裹元素类名                                                                                                                        | string                                 | -          |
| wrapStyle       | 列表包裹元素内联样式                                                                                                                    | object                                 | `{}`       |
| topThreshold    | 触发`toTop` 事件的阈值                                                                                                                  | number                                 | 0          |
| bottomThreshold | 触发`toBottom` 事件的阈值                                                                                                               | number                                 | 0          |
| observeResize   | 不响应列表元素尺寸变化，如果尺寸不变，最好设置它可以优化性能                                                                            | boolean                                | `true`     |
| height          | 内容高度                                                                                                                                | number/string                          | -          |
| maxHeight       | 内容最大高度                                                                                                                            | number/string                          | -          |
| native          | 是否使用原生滚动样式                                                                                                                    | boolean                                | `false`    |
| always          | 总是显示滚动条                                                                                                                          | boolean                                | `false`    |
| minSize         | 滚动条滑块的最小尺寸                                                                                                                    | number                                 | `20`       |
| shadow          | 显示待滚动区域阴影                                                                                                                      | boolean / `{ x: boolean, y: boolean }` | `false`    |

## VirtualList Events

| 事件名称 | 说明                               | 回调参数                      |
| -------- | ---------------------------------- | ----------------------------- |
| scroll   | 滚动时触发                         | (event: Event, range) => void |
| toTop    | 当滚动到顶部或者左边时触发         | () => void                    |
| toBottom | 当滚动到底部或者右边时触发，无参数 | () => void                    |
| resized  | 列表项渲染尺寸改变时调用           | (id, size}) => void           |

## VirtualList Methods

| 名称           | 说明                                                                                   | 参数                     |
| -------------- | -------------------------------------------------------------------------------------- | ------------------------ |
| reset          | 将所有状态重置回初始状态                                                               | () => void               |
| scrollToBottom | 手动将滚动位置设置为底部                                                               | () => void               |
| scrollToIndex  | 手动将滚动位置设置为指定索引                                                           | (index: number) => void  |
| scrollToOffset | 手动将滚动位置设置为相对指定偏移量                                                     | (offset: number) => void |
| getSize        | 按 id（从`data-key`）获取指定的列表项尺寸。如果已渲染列表中没有该项，则返回`undefined` | (id: number) => number   |
| getSizes       | 获取存储（渲染）项的总数                                                               | () => number             |
| getOffset      | 获取当前滚动偏移量                                                                     | () => number             |
| getClientSize  | 获取包装器元素客户端视口大小（宽度或高度）                                             | () => number             |
| getScrollSize  | 获取所有滚动大小（滚动高度或滚动宽度）                                                 | () => number             |
