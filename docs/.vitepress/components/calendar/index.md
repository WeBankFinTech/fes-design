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

### 按年展示

--MODEMONTH

### 分割线的展示

--SPLITLINE

### 自定义日历附加内容

--CUSTOM

--CODE

## Props

| 属性         | 说明                        | 类型                                | 默认值 |
|--------------|---------------------------|-------------------------------------|--------|
| v-model      | 当前高亮标记的日期          | `number` (UnixTime)                 | 今天   |
| v-model:mode | 显示模式（按月展示、按年展示） | `date` `month`                      | `date` |
| splitLine    | 是否展示分割线              | `boolean`                           | `true` |
| height       | 组件高度                    | `string \| number`                  | -      |
| shortcuts    | 快捷选项                    | `{ label: string, time: number }[]` | `[]`   |

## Slots

| 名称          | 说明                     | 参数                                          |
|---------------|------------------------|-----------------------------------------------|
| cellMain      | 单元格主要内容（日期部分） | `{ date: UnixTime, mode: 'month' \| 'date' }` |
| cellAppendant | 单元格附加内容           | `{ date: UnixTime, mode: 'month' \| 'date' }` |

## Events

| 事件名称  | 说明           | 回调参数                                     |
|-----------|--------------|----------------------------------------------|
| cellClick | 点击日历中格子 | `{ date: UnixTime, mode: 'month' \|'date' }` |
