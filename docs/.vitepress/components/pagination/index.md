# Pagination 分页

采用分页的形式分隔长列表，每次只加载一个页面。

## 组件注册

```js
import { FPagination } from 'fes-design';

app.use(FPagination);
```

## 代码演示

### 基础用法


--BASE


### 电梯直达


--JUMPER

### 每页数量


--SIZES

### 组合类型


--COMBINATION

### 简洁型


--SIMPLE

### 小型号


--SMALL


--CODE

## Props

| 属性     | 说明                                                                               | 类型    | 默认值    |
| -------- | ---------------------------------------------------------------------------------- | ------- | --------- |
| pageSize(v-model) | 每页显示条目个数                                                                       | number | `10`   |
| currentPage(v-model)  | 当前页码                                       | number  | `1`  |
| totalCount | 总条数                           | number  | `0`  |
| pageSizeOption  | 每页条数                | array | `[10, 20, 30, 50, 100]`   |
| showQuickJumper     | 是否显示快速跳转                                                           | boolean | `false`   |
| showSizeChanger | 是否显示每页条数的选择器                                         | boolean  | `false`     |
| showTotal     | 是否显示总条数 | boolean  | `false` |
| small     | 是否使用小型分页样式 | boolean  | `false` |
| simple     | 是否使用简洁样式 | boolean  | `false` |


## Events

| 事件名称 | 说明             | 回调参数        |
| -------- | ---------------- | --------------- |
| change    | 页码改变的回调，参数是改变后的页码及每页条数 | (currentPage) => void |
| pageSizeChange    | 页码改变的回调，参数是改变后的页码及每页条数 | (pageSize) => void |
