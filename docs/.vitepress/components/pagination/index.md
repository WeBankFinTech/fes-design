# Pagination 分页

采用分页的形式分隔长列表，每次只加载一个页面。

## 组件注册

```js
import { FPagination } from '@fesjs/fes-design';

app.use(FPagination);
```

## 代码演示

### 基础用法

--COMMON

### 电梯直达

设置 show-quick-jumper 属性为 true ，显示快速跳转

--JUMPER

### 每页数量

设置 show-size-changer 属性为 true ，显示每页条数的选择器。

设置 pageSizeOption 控制选择器选项，默认为 [10, 20, 30, 50, 100]

--SIZES

### 显示总数

设置 show-total 属性为 true ，显示总条数

--TOTAL

### 组合类型

--COMBINATION

### 简洁型

设置 simple 属性为 true ，显示简洁的分页器。

--SIMPLE

### 小型号

设置 small 属性为 true ，让分页变小。

--SMALL

--CODE

## Props

| 属性                 | 说明                     | 类型    | 默认值                  |
| -------------------- | ------------------------ | ------- | ----------------------- |
| pageSize(v-model)    | 每页显示条目个数         | number  | `10`                    |
| currentPage(v-model) | 当前页码                 | number  | `1`                     |
| totalCount           | 总条数                   | number  | `0`                     |
| pageSizeOption       | 每页条数                 | array   | `[10, 20, 30, 50, 100]` |
| showQuickJumper      | 是否显示快速跳转         | boolean | `false`                 |
| showSizeChanger      | 是否显示每页条数的选择器 | boolean | `false`                 |
| showTotal            | 是否显示总条数           | boolean | `false`                 |
| small                | 是否使用小型分页样式     | boolean | `false`                 |
| simple               | 是否使用简洁样式         | boolean | `false`                 |

## Events

| 事件名称       | 说明                                                             | 回调参数                        |
| -------------- | ---------------------------------------------------------------- | ------------------------------- |
| change         | currentPage 或 pageSize 改变的回调，参数是改变后的页码及每页条数 | (currentPage, pageSize) => void |
| pageSizeChange | pageSize 改变的回调，参数是改变后的每页条数                      | (pageSize) => void              |
