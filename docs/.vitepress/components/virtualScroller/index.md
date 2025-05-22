# VirtualScroller 虚拟滚动

比虚拟列表有更好的渲染性能。

## 组件注册

```js
import { FVirtualScroller } from 'fes-design';

app.use(FVirtualScroller);
```

## 代码演示

### 不规则纵向滚动

:::demo
common.vue
:::

### 不规则横向滚动

:::demo
horizontal.vue
:::

### 无限滚动

:::demo
infinite.vue
:::

### 滚动操作

:::demo
scroll.vue
:::

## VirtualScroller Props

| 属性            | 说明                                                                                                                                    | 类型                                   | 默认值     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------- |
| dataSources     | 为列表生成的源数组，每个数组数据必须是一个对象                                  | Array\<Object\>                        | `-`        |
| keeps           | 您期望虚拟列表在真实 `dom` 中保持渲染的项目数量。                                                                                       | number                                 | 30         |
| itemSize    | 每项的估计大小，如果它更接近平均大小，滚动条长度看起来更准确。建议指定自己计算的平均值                                                  | number                                 | 50         |
| itemTag    |  子项的包裹元素                                           | number                                 | `div`         |
| itemProps    |  子项包裹元素的属性                                           | function                                 | `({ item, index }: { item: ItemData; index: number }) => any`         |
| direction       | 滚动的方向, 可选值为 `vertical` 和 `horizontal`                                                                                         | string                                 | `vertical` |
| wrapTag         | 列表包裹元素名称                                                                                                                        | string                                 | `div`      |
| wrapClass       | 列表包裹元素类名                                                                                                                        | string                                 | -          |
| wrapStyle       | 列表包裹元素内联样式                                                                                                                    | object                                 | `{}`       |
| scrollbarProps       | 滚动条样式，参考滚动条组件                                                                                                                    | object                                 | -       |

## VirtualScroller Events

| 事件名称 | 说明                               | 回调参数                      |
| -------- | ---------------------------------- | ----------------------------- |
| scroll   | 滚动时触发                         | (event: Event, range) => void |
| toTop    | 当滚动到顶部或者左边时触发         | () => void                    |
| toBottom | 当滚动到底部或者右边时触发，无参数 | () => void                    |

## VirtualScroller Methods

| 名称           | 说明                                                                                   | 参数                     |
| -------------- | -------------------------------------------------------------------------------------- | ------------------------ |
| scrollRef          | 滚动条                                                               |  -               |
| scrollToIndex | 手动将滚动位置设置为指定索引                                                               | () => void               |
| scrollToBottom  | 手动将滚动位置设置到最底部                                                           | (index: number) => void  |
| scrollBy | 手动将滚动位置设置为相对指定偏移量                                                     | (offset: number) => void |
| scrollTo | 手动将滚动位置设置为指定偏移量                                                     | (offset: number) => void |
| getItemOffset        | 获取选项位置  | (index: number) => number   |
| getItemSize       | 获取选项大小                                                            | (index: number) => number             |
| getOffset      | 获取当前滚动偏移量                                                                     | () => number             |
| getClientSize  | 获取包装器元素客户端视口大小（宽度或高度）                                             | () => number             |
| getScrollSize  | 获取所有滚动大小（滚动高度或滚动宽度）                                                 | () => number             |
| findStartIndex  | 获取显示的初始元素索引                                            | () => number             |
| findEndIndex  | 获取显示的结束元素索引                                              | () => number             |
