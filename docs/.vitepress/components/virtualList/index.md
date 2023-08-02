# VirtualList 虚拟列表

当列表的数据量很大时，使用虚拟列表呈现内容。

## 组件注册

```js
import { FVirtualList } from 'fes-design';

app.use(FVirtualList);
```

## 代码演示

### 1. 不规则纵向滚动列表

--VERTICAL

### 2. 不规则横向滚动列表

--HORIZONTAL

--CODE

## VirtualList Props

| 属性            | 说明                                                                                                                                    | 类型                  | 默认值     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| dataKey         | 从`dataSources`中的每个数据对象获取唯一键。或者使用每个数据源调用函数并返回其唯一键。其值在数据源中必须是唯一的，用于标识每一项的尺寸。 | string \| ()=> string | `-`        |
| dataSources     | 为列表生成的源数组，每个数组数据必须是一个对象，并且具有唯一的 key get 或 generate for`data key`属性。                                  | Array\<Object\>       | `-`        |
| keeps           | 您期望虚拟列表在真实 `dom` 中保持渲染的项目数量。                                                                                       | number                | 30         |
| estimateSize    | 每项的估计大小，如果它更接近平均大小，滚动条长度看起来更准确。建议指定自己计算的平均值                                                  | number                | 50         |
| start           | 设置滚动位置保持开始索引                                                                                                                | number                | 0          |
| offset          | 设置滚动位置保持偏移                                                                                                                    | number                | 0          |
| direction       | 滚动的方向, 可选值为 `vertical` 和 `horizontal`                                                                                         | string                | `vertical` |
| wrapTag         | 列表包裹元素名称                                                                                                                        | string                | `div`      |
| wrapClass       | 列表包裹元素类名                                                                                                                        | string                | -          |
| wrapStyle       | 列表包裹元素内联样式                                                                                                                    | object                | `{}`       |
| height          | 高度                                                                                                                                    | number                | -          |
| maxHeight       | 最大高度                                                                                                                                | number                | -          |
| topThreshold    | 触发`totop` 事件的阈值                                                                                                                  | number                | 0          |
| bottomThreshold | 触发`tobottom` 事件的阈值                                                                                                               | number                | 0          |

## VirtualList Events

| 事件名称 | 说明                               | 回调参数               |
| -------- | ---------------------------------- | ---------------------- |
| scroll   | 滚动时触发                         | (event, range) => void |
| totop    | 当滚动到顶部或者左边时触发         | () => void             |
| tobottom | 当滚动到底部或者右边时触发，无参数 | () => void             |
| resized  | 开始拖拽时调用                     | (id, size}) => void    |

## VirtualList Method

<table>
  <tr>
    <th><span style="width:150px;display:inline-block;">方法</span></th>
    <th>描述</th>
  </tr>
  <tr>
    <td><code>reset()</code></td>
    <td>将所有状态重置回初始状态。</td>
  </tr>
  <tr>
    <td><code>scrollToBottom()</code></td>
    <td>手动将滚动位置设置为底部。</td>
  </tr>
  <tr>
    <td><code>scrollToIndex(index)</code></td>
    <td>手动将滚动位置设置为指定索引。 </td>
  </tr>
  <tr>
    <td><code>scrollToOffset(offset)</code></td>
    <td>手动将滚动位置设置为指定的偏移量。</td>
  </tr>
  <tr>
    <td><code>getSize(id)</code></td>
    <td>按id（从<code>data-key</code>）获取指定的项目大小。如果已渲染列表中没有该项，则返回<code>undefined</code>。</td>
  </tr>
  <tr>
    <td><code>getSizes()</code></td>
    <td>获取存储（渲染）项的总数。</td>
  </tr>
  <tr>
    <td><code>getOffset()</code></td>
    <td>获取当前滚动偏移量。 </td>
  </tr>
  <tr>
    <td><code>getClientSize()</code></td>
    <td>获取包装器元素客户端视口大小（宽度或高度）。</td>
  </tr>
  <tr>
    <td><code>getScrollSize()</code></td>
    <td>获取所有滚动大小（滚动高度或滚动宽度）。 </td>
  </tr>
</table>
