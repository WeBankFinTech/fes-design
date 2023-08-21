# Grid 栅格

布局的栅格化系统，我们是基于行（grid）和列（gridItem）来定义信息区块的外部框架，以保证页面的每个区域能够稳健地排布起来。下面简单介绍一下它的工作原理：

-   通过`grid`在水平方向建立一组`gridItem`
-   你的内容应当放置于`gridItem`内，并且，只有`gridItem`可以作为`grid`的直接元素
-   栅格系统中的列是指 1 到 24 的值来表示其跨越的范围。例如，三个等宽的列可以使用 `` 来创建
-   如果一个`grid`中的`gridItem`总和超过 24，那么多余的`gridItem`会作为一个整体另起一行排列

## 组件注册

```js
import { FGrid, FGridItem } from '@fesjs/fes-design';

app.use(FGrid);
app.use(FGridItem);
```

## 代码演示

### 基础用法

从堆叠到水平排列。

使用单一的一组 `Grid` 和 `GridItem` 栅格组件，就可以创建一个基本的栅格系统。

--COMMON

### 分栏间隔

分栏之间存在间隔。

#### 水平间隔

--GUTTERX

#### 水平垂直间隔

当列超出一行时，默认不换行。如果设置`wrap`为`true`，则会换行显示。可以通过设置`gutter`控制换行之后的间隔。

--GUTTERY

### 分栏偏移

支持偏移指定的栏数。

--OFFSET

### 对齐方式

默认使用 `flex` 布局来对分栏进行灵活的对齐。

#### 水平排列

在水平排列方向上的对齐方式跟`flex`的`justify-content`属性一致。

--JUSTIFY

#### 垂直排列

在垂直排列方向上的对齐方式跟`flex`的`align-items`属性一致。

--ALIGN

### 排序

通过 `order` 来改变元素的排序。

--ORDER

### Flex 填充

`GridItem` 提供 `flex` 属性以支持填充。

--FLEX

### 响应式布局

参照 Bootstrap 的 响应式设计，预设七个响应尺寸：`xs`、`sm`、`md`、`lg`、`xl`、`xxl`、`xxxl`。

--RESPONSIVE

--CODE

## Grid Props

| 属性    | 说明                                                                                             | 类型         | 默认值       |
| ------- | ------------------------------------------------------------------------------------------------ | ------------ | ------------ |
| align   | `flex` 布局下的垂直对齐方式：'flex-start'、 'center'、 'flex-end'、 'baseline'、 'stretch'       | string       | `flex-start` |
| gutter  | 栅格间隔，可以写成像素值，表示水平间隔。或者使用数组同时设置[水平间距,垂直间距]。                | number/array | 0            |
| justify | `flex` 布局下的水平排列方式：`flex-start`、`flex-end`、`center`、`space-around`、`space-between` | string       | `flex-start` |
| wrap    | 是否自动换行                                                                                     | boolean      | `false`      |

## GridItem Props

| 属性   | 说明                                                     | 类型          | 默认值 |
| ------ | -------------------------------------------------------- | ------------- | ------ |
| flex   | `flex` 布局填充                                          | string/number | `-`    |
| offset | 栅格左侧的间隔格数                                       | number        | 0      |
| order  | 栅格的顺序，从小到大排列                                 | number        | -      |
| pull   | 栅格向左移动格数                                         | number        | 0      |
| push   | 栅格向右移动格数                                         | number        | 0      |
| span   | 栅格占位格数，为 0 时相当于 display: none                | number        | `-`    |
| xs     | `<576px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number/object | `-`    |
| sm     | `≥576px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number/object | `-`    |
| md     | `≥768px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number/object | `-`    |
| lg     | `≥992px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number/object | `-`    |
| xl     | `≥1200px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | number/object | `-`    |
| xxl    | `≥1600px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | number/object | `-`    |
| xxxl   | `≥2000px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | number/object | `-`    |
