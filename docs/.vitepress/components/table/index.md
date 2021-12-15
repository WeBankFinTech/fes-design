# Table 表格

## 组件注册

```js
import FTable from 'fes-design';

app.use(FTable);
```

## 代码演示

### 基础用法

当 `f-table` 元素中注入 `data` 对象数组后，在 `f-table-column` 中用 `prop` 属性来对应对象中的键名即可填入数据，用 `label` 属性来定义表格的列名。可已使用`width` 属性来定义列宽。

--COMMON

#### 带边框表格

配置`bordered`即可。

--BORDERED

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

--HEADER

### 多选

选择多行数据时使用 Checkbox。

--CHECKBOX

### 操作

简单的操作类型。

--ACTION

### 自定义列模板

自定义列的显示内容，可组合其他组件使用。

--TEMPLATE

### 展开行

当行内容过多并且不想显示横向滚动条时，可以使用展开行功能。

--EXPAND

### 合并行或列

多行或多列共用一个数据时，可以合并行或列。

--SPAN


### 无数据

--NODATA

--CODE

## FTable Props

| 属性         | 说明                                                                          | 类型                                             | 可选值 | 默认值     |
| ------------ | ----------------------------------------------------------------------------- | ------------------------------------------------ | ------ | ---------- |
| bordered     | 是否展示列边框                                                                | boolean                                          | -      | `false`    |
| rowClassName | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。 | function({row, rowIndex}) / string               | -      | -          |
| rowStyle     | 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。 | function({row, rowIndex}) / object               | -      | -          |
| data         | 数据                                                                          | array                                            | -      | `[]`       |
| emptyText    | 空数据时显示的文本内容，也可以通过 #empty 设置                                | string                                           | -      | `暂无数据` |
| height       | table 的高度，如果内容过多超出时则表头固定，内容滚动                          | Number                                           | -      | -          |
| rowKey       | 行数据的 Key，用来优化 Table 的渲染                                           | function(row) / String                           | -      | -          |
| showHeader   | 是否展示表头                                                                  | boolean                                          | -      | `true`     |
| spanMethod   | 合并行或列的计算方法                                                          | function({ row, column, rowIndex, columnIndex }) | -      | -          |

## FTable Slots

| 名称    | 说明                       |
| ------- | -------------------------- |
| `empty` | 自定义表格没有数据时的内容 |

## FTable Events

| 事件名称         | 说明                                         | 回调参数                        |
| ---------------- | -------------------------------------------- | ------------------------------- |
| cell-click       | 当某个单元格被点击时会触发该事件             | object({row, column, cellValue, event})  |
| expand-change    | 当用户对某一行展开或者关闭的时候会触发该事件 | object({ row })                        |
| header-click     | 当某一列的表头被点击时会触发该事件           | object({column, event})               |
| row-click        | 当某一行被点击时会触发该事件                 | object({row, event})                    |
| select           | 当用户手动勾选数据行的 Checkbox 时触发的事件 | object({ selection, row, checked})      |
| select-all       | 当用户手动勾选全选 Checkbox 时触发的事件     | object({ selection, checked })          |
| selection-change | 当选择项发生变化时会触发该事件               | object({ selection })                   |

## FTable Methods

| 名称               | 说明                               | 参数  |
| ------------------ | ---------------------------------- | ----- |
| clearSelection     | 用于多选表格，清空用户的选择       | -     |
| toggleRoFSelection | 用于多选表格，切换某一行的选中状态 | {row} |
| toggleAllSelection | 用于多选表格，切换全选和全不选     | -     |

## FTableColumn Props

| 属性         | 说明                                                                                  | 类型                                                                 | 可选值                | 默认值  |
| ------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------- | ------- |
| action       | 操作                                                                                  | array / object                                                       | -                     | -       |
| align        | 对齐方式                                                                              | string                                                               | left / center / right | `left`  |
| colClassName | 列的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。         | function({ row, column, rowIndex, columnIndex, cellValue }) / string | -                     | -       |
| colStyle     | 列的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。         | function({ row, column, rowIndex, columnIndex, cellValue }) / object | -                     | -       |
| fixed        | 列是否固定在左侧或者右侧，true 表示固定在左侧                                         | string / boolean                                                     | true / left / right   | -       |
| formatter    | 用来格式化内容                                                                        | function({row, column, rowIndex, columnIndex, cellValue})            | -                     | -       |
| label        | 列的标题，也可以使用 `#header` 自定义                                                 | string                                                               | -                     | -       |
| minWidth     | 列最小的宽度，如果容器宽度够大，则会自适应补偿                                        | string                                                               | -                     | -       |
| prop         | 列内容的字段名                                                                        | string                                                               | -                     | -       |
| selectable   | 仅对 type=selection 的列有效，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选 | function({row, rowIndex})                                            | -                     | -       |
| type         | 列的类型，如果设置为`selection`则显示选择器，如果设置为`expand`则显示一个展开按钮     | string                                                               | selection / expand    | `false` |
| width        | 对应列的宽度，优先级大于 minWidth                                                     | string                                                               | -                     | -       |
| ellipsis     | 设置宽度后，如果文本溢出后出现省略号                                                  | boolean                                                              | -                     | false   |

## FTableColumn Slots

| 名称    | 说明                                                                     | 参数 |
| ------- | ------------------------------------------------------------------------ |   ------- |
| default | 自定义列的内容 | object({ row, column, rowIndex, columnIndex, cellValue }） |
| header  | 自定义表头的内容                         | object({ column, columnIndex } ) |
