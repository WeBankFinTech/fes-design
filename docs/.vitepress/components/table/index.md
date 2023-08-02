# Table 表格

## 组件注册

```js
import FTable from '@fesjs/fes-design';

app.use(FTable);
```

## 代码演示

### 基础用法

当 `f-table` 元素中注入 `data` 对象数组后，在 `f-table-column` 中用 `prop` 属性来对应对象中的键名即可填入数据，用 `label` 属性来定义表格的列名。可已使用`width` 属性来定义列宽。

--COMMON

#### 边框和分割线

默认无边框，配置`bordered`则有

--BORDERED

默认有水平分割线，配置`horizontalLine=false`则无水平分割线

--horizontalLine

默认无垂直分割线，配置`verticalLine`则有

--verticalLine

### 固定表头

纵向内容过多时，可选择固定表头。配置`height`属性，当内容高度超出时出现滚动条。

--HEIGHT

### 固定列

横向内容过多时，可选择固定列。

--FIXED

### 固定列和表头

横纵内容过多时，可选择固定列和表头。

--SCROLL

### 多级表头

数据结构比较复杂的时候，可使用多级表头来展现数据的层次关系。

--MULTIHEADER

### 多选

选择多行数据时使用 Checkbox。

--CHECKBOX

### 排序

--SORT

### 操作

简单的操作类型。

--ACTION

### 自定义列模板

自定义列的显示内容，可组合其他组件使用。

--TEMPLATE

### 虚拟滚动

1W 行数据也不会卡~

--VIRTUAL

### 可拖拽

--DRAGGABLE

### 展开行

当行内容过多并且不想显示横向滚动条时，可以使用展开行功能。

--EXPAND

### 合并行或列

多行或多列共用一个数据时，可以合并行或列。

--SPAN

### 无数据

--NODATA

### 使用 columns 配置列

--COLUMNS

### 列宽可拖拽配置

--resizable

--CODE

## FTable Props

| 属性                  | 说明                                                                                                    | 类型                                                                                                             | 可选值           | 默认值     |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| bordered              | 是否展示列边框                                                                                          | boolean                                                                                                          | -                | `false`    |
| horizontalLine        | 是否展示水平分割线                                                                                      | boolean                                                                                                          | -                | `true`     |
| verticalLine          | 是否展示垂直分割线                                                                                      | boolean                                                                                                          | -                | `false`    |
| rowClassName          | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。                           | string \| object \| array \| ({ row, column, rowIndex, columnIndex, cellValue })=> ( object \| array \| string ) | -                | -          |
| rowStyle              | 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。                           | object \| ({row, rowIndex})=> object                                                                             | -                | -          |
| data                  | 数据                                                                                                    | array                                                                                                            | -                | `[]`       |
| emptyText             | 空数据时显示的文本内容，也可以通过 #empty 设置                                                          | string                                                                                                           | -                | `暂无数据` |
| height                | table 的高度，如果内容过多超出时则表头固定，内容滚动                                                    | number                                                                                                           | -                | -          |
| rowKey                | 行数据的 Key，用来优化 Table 的渲染                                                                     | string \| (row)=> string                                                                                         | -                | -          |
| showHeader            | 是否展示表头                                                                                            | boolean                                                                                                          | -                | `true`     |
| spanMethod            | 合并行或列的计算方法                                                                                    | _({ row, column, rowIndex, columnIndex }) => { rowspan: string, colspan: string }_                               | -                | -          |
| virtualScroll         | 是否启动虚拟滚动，当启用时不支持展开行                                                                  | boolean                                                                                                          | -                | false      |
| size                  | table 的间距大小                                                                                        | string                                                                                                           | `middle` `small` | `middle`   |
| layout                | table 列宽度分割算法，`fixed`为等分，`auto`按内容大小比例。只有不设置 height 和不启动虚拟滚动时才生效！ | string                                                                                                           | `auto` `fixed`   | `fixed`    |
| draggable             | 是否开启拖拽，开启虚拟滚动后失效                                                                        | boolean                                                                                                          | -                | `false`    |
| beforeDragend         | 拖拽结束之前调用，当返回 false、Promise.resolve(false)、Promise.reject()时，拖拽会恢复之前的状态        | [`BeforeDragEnd`](./draggable#阻止拖拽)                                                                          | -                | （）= true |
| expandedKeys(v-model) | 展开的节点的 key 的数组                                                                                 | Array<string \| number>                                                                                          | -                | `[]`       |
| checkedKeys(v-model)  | 勾选节点 key 的数组                                                                                     | Array<string \| number>                                                                                          | -                | `[]`       |
| columns               | 列的配置信息                                                                                            | Array\<ColumnChildren\>                                                                                          | -                | `-`        |

## FTable Slots

| 名称    | 说明                       |
| ------- | -------------------------- |
| `empty` | 自定义表格没有数据时的内容 |

## FTable Events

| 事件名称        | 说明                                         | 回调参数                                                                                 |
| --------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| cellClick       | 当某个单元格被点击时会触发该事件             | ({row, column, cellValue, event})=> void                                                 |
| expandChange    | 当用户对某一行展开或者关闭的时候会触发该事件 | ({ row, expanded })=> void                                                               |
| headerClick     | 当某一列的表头被点击时会触发该事件           | ({column, event}) => void                                                                |
| rowClick        | 当某一行被点击时会触发该事件                 | ({row, event}) => void                                                                   |
| select          | 当用户手动勾选数据行的 Checkbox 时触发的事件 | ({ selection, row, checked})=> void                                                      |
| selectAll       | 当用户手动勾选全选 Checkbox 时触发的事件     | ({ selection, checked }) => void                                                         |
| selectionChange | 当选择项发生变化时会触发该事件               | (selection) => void                                                                      |
| dragstart       | 拖拽开始触发                                 | (event, item, index) => void                                                             |
| dragend         | 拖拽结束触发                                 | (event, item, index) => void                                                             |
| sortChange      | 点击排序后触发                               | ({prop?: string; order?: 'descend' \| 'ascend'; sorter?: Function \| 'default'}) => void |

## FTable Methods

| 名称               | 说明                               | 参数                                                          |
| ------------------ | ---------------------------------- | ------------------------------------------------------------- |
| clearSelection     | 用于多选表格，清空用户的选择       | () => void                                                    |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态 | ({row: RowType})=> void                                       |
| toggleAllSelection | 用于多选表格，切换全选和全不选     | () => void                                                    |
| toggleRowExpend    | 用于控制某行的展开隐藏             | ({row: RowType})=> void                                       |
| sort               | 设定表格的排序状态                 | (prop: string, order: 'ascend' \| 'descend' \| false) => void |
| clearSorter        | 清空所有排序状态                   | () => void                                                    |

## FTableColumn Props

| 属性           | 说明                                                                                                  | 类型                                                                                                             | 可选值                | 默认值                  |
| -------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------- |
| action         | 操作                                                                                                  | array \| object                                                                                                  | -                     | -                       |
| align          | 对齐方式                                                                                              | string                                                                                                           | left / center / right | `left`                  |
| colClassName   | 列的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。                         | string \| object \| array \| ({ row, column, rowIndex, columnIndex, cellValue })=> ( object \| array \| string ) | -                     | -                       |
| colStyle       | 列的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。                         | object \| ({ row, column, rowIndex, columnIndex, cellValue }) => object                                          | -                     | -                       |
| fixed          | 列是否固定在左侧或者右侧，true 表示固定在左侧                                                         | string \| boolean                                                                                                | true / left / right   | -                       |
| formatter      | 用来格式化内容                                                                                        | ({row, column, rowIndex, columnIndex, cellValue}) => any                                                         | -                     | -                       |
| label          | 列的标题，也可以使用 `#header` 自定义                                                                 | string                                                                                                           | -                     | -                       |
| minWidth       | 列最小的宽度，如果容器宽度够大，则会自适应补偿                                                        | number                                                                                                           | -                     | -                       |
| prop           | 列内容的字段名                                                                                        | string                                                                                                           | -                     | -                       |
| selectable     | 仅对 type=selection 的列有效，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选                 | ({row, rowIndex}) => boolean                                                                                     | -                     | -                       |
| type           | 列的类型，如果设置为`selection`则显示选择器，如果设置为`expand`则显示一个展开按钮                     | string                                                                                                           | selection / expand    | `false`                 |
| width          | 对应列的宽度，优先级大于 minWidth                                                                     | number                                                                                                           | -                     | -                       |
| ellipsis       | 设置宽度后，如果文本溢出后出现省略号，设置为对象时参考 Ellipsis 组件配置                              | boolean \| Object                                                                                                | -                     | `false`                 |
| visible        | 是否显示列                                                                                            | boolean                                                                                                          | -                     | `true`                  |
| sortable       | 是否排序列                                                                                            | boolean                                                                                                          | -                     | `false`                 |
| sorter         | 排序方法，如果设为 'default' 表格将会使用一个内置的排序函数；其他工作的方式类似 Array.sort 的对比函数 | ((a: RowType, b: RowType) => boolean) \| 'default'                                                               | -                     | `default`               |
| sortDirections | 支持的排序方式                                                                                        | string[]                                                                                                         | -                     | `['ascend', 'descend']` |
| resizable      | 列是否可设置大小                                                                                      | boolean                                                                                                          | -                     | `false`                 |

## FTableColumn Slots

| 名称    | 说明             | 类型                                                           |
| ------- | ---------------- | -------------------------------------------------------------- |
| default | 自定义列的内容   | ({ row, column, rowIndex, columnIndex, cellValue }）=> VNode[] |
| header  | 自定义表头的内容 | ({ column, columnIndex }) => VNode[]                           |

## ColumnChildren

`ColumnChildren` 跟 `FTableColumn Props` 保持一致，使用 render 函数替代`FTableColumn`组件的插槽。

| 名称         | 说明             | 类型                                                           |
| ------------ | ---------------- | -------------------------------------------------------------- |
| render       | 自定义列的内容   | ({ row, column, rowIndex, columnIndex, cellValue }) => VNode[] |
| renderHeader | 自定义表头的内容 | ({ column, columnIndex }) => VNode[]                           |
