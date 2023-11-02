# Calendar 日历
日历一般用于需要按照日期规划日程并能够按照日期记录和查看日程安排的场景中

## 组件注册

```js
import { FCalendar } from '@fesjs/fes-design';

app.use(FCalendar);
```

## 代码演示

### 基础用法

--BASIC

### 分割线的展示

--SPLITLINE

### 自定义日历附加内容

--CUSTOM

--CODE

## Props

| 属性               | 说明                   | 类型                                | 默认值 |
| ------------------ | ---------------------- | ----------------------------------- | ------ |
| v-model:date       | 控制日历当前显示的月份 | `number` (UnixTime)                 | 今天   |
| v-model:mode       | 显示模式（日历、月历） | `month` `date`                      | `date` |
| v-model:activeDate | 当前高亮标记的日期     | `number` (UnixTime)                 | 今天   |
| splitLine          | 是否展示分割线         | `boolean`                           | `true` |
| shortcuts          | 快捷选项               | `{ label: string, time: number }[]` | `[]`   |

## Slots

| 名称 | 说明     | 参数  |
| ---- | -------- | ----- |
| cell | 单元格 | `{ date: UnixTime, mode: 'month' \| 'date' }` |

## Events

| 事件名称  | 说明           | 回调参数                                     |
| --------- | -------------- | -------------------------------------------- |
| cellClick | 点击日历中格子 | `{ date: UnixTime, mode: 'month' \|'date' }` |
