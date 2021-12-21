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

## 虚拟列表属性和方法

### 必须的属性

| **<span style="width:150px;display:inline-block;">属性</span>** | **类型**  | **描述**                                                               |
|------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dataKey`       | String\|Function | 从`dataSources`中的每个数据对象获取唯一键。或者使用每个数据源调用函数并返回其唯一键。其值在数据源中必须是唯一的，用于标识每一项的尺寸。 |
| `dataSources`   | Array[Object]    | 为列表生成的源数组，每个数组数据必须是一个对象，并且具有唯一的key get或generate for`data key`属性。 |

### 其他属性

  <p></p>
  <table>
    <tr>
      <th><span style="width:150px;display:inline-block;">属性</span></th>
      <th>类型</th>
      <th><span style="width:50px;display:inline-block;">默认值</span></th>
      <th>描述</th>
    </tr>
    <tr>
      <td><code>keeps</code></td>
      <td>Number</td>
      <td>30</td>
      <td>您期望虚拟列表在真实 dom 中保持渲染的项目数量。 </td>
    </tr>
    <tr>
      <td><code>extraProps</code></td>
      <td>Object</td>
      <td>{}</td>
      <td>分配给组件一些不在<code>dataSources</code>中的属性. 注意: <code>index</code> 和 <code>source</code> 都被内部占用了.</td>
    </tr>
    <tr>
      <td><code>estimateSize</code></td>
      <td>Number</td>
      <td>50</td>
      <td>每个<code>Item</code>的估计大小，如果它更接近平均大小，滚动条长度看起来更准确。建议指定自己计算的平均值。</td>
    </tr>
    <tr>
      <td><code>start</code></td>
      <td>Number</td>
      <td>0</td>
      <td>设置滚动位置保持开始索引。</td>
    </tr>
    <tr>
      <td><code>offset</code></td>
      <td>Number</td>
      <td>0</td>
      <td>设置滚动位置保持偏移。 </td>
    </tr>
    <tr>
      <td><code>scroll</code></td>
      <td>Event</td>
      <td></td>
      <td>滚动时触发, 参数 <code>(event, range)</code>。</td>
    </tr>
    <tr>
      <td><code>totop</code></td>
      <td>Event</td>
      <td></td>
      <td>当滚动到顶部或者左边时触发, 无参数。</td>
    </tr>
    <tr>
      <td><code>tobottom</code></td>
      <td>Event</td>
      <td></td>
      <td>当滚动到底部或者右边时触发，无参数。</td>
    </tr>
    <tr>
      <td><code>resized</code></td>
      <td>Event</td>
      <td></td>
      <td>当大小改变时触发 (mounted), 参数 <code>(id, size)</code>。</td>
    </tr>
    <tr>
      <td><code>direction</code></td>
      <td>String</td>
      <td>vertical</td>
      <td>滚动的方向, 可选值为 <code>vertical</code> 和 <code>horizontal</code>。</td>
    </tr>
    <tr>
      <td><code>topThreshold</code></td>
      <td>Number</td>
      <td>0</td>
      <td>发出<code>totop</code> 事件的阈值, 注意多个调用。</td>
    </tr>
    <tr>
      <td><code>bottomThreshold</code></td>
      <td>Number</td>
      <td>0</td>
      <td>发出<code>tobottom</code> 事件的阈值, 注意多个调用。</td>
    </tr>
    <tr>
      <td><code>rootTag</code></td>
      <td>String</td>
      <td>div</td>
      <td>根节点的名称。</td>
    </tr>
    <tr>
      <td><code>wrapTag</code></td>
      <td>String</td>
      <td>div</td>
      <td>列表包裹元素名称<code>(role=group)</code>。</td>
    </tr>
    <tr>
      <td><code>wrapClass</code></td>
      <td>String</td>
      <td></td>
      <td>列表包裹元素类名。</td>
    </tr>
    <tr>
      <td><code>wrapStyle</code></td>
      <td>Object</td>
      <td>{}</td>
      <td>列表包裹元素内联样式。</td>
    </tr>
    <tr>
      <td><code>itemTag</code></td>
      <td>String</td>
      <td>div</td>
      <td>项目包裹元素名称。</td>
    </tr>
    <tr>
      <td><code>itemClass</code></td>
      <td>String</td>
      <td></td>
      <td>项目包裹元素类名。</td>
    </tr>
    <tr>
      <td><code>itemClassAdd</code></td>
      <td>Function</td>
      <td></td>
      <td>一个函数，您可以将额外的类（字符串）返回给项包装器元素， 参数 <code>(index)</code>。</td>
    </tr>
    <tr>
      <td><code>itemStyle</code></td>
      <td>Object</td>
      <td>{}</td>
      <td>项目包裹元素内联样式。</td>
    </tr>
    <tr>
      <td><code>itemScopedSlots</code></td>
      <td>Object</td>
      <td>{}</td>
      <td>Item组件的 slot。</td>
    </tr>
  </table>

### 公共方法

  <p></p>
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
