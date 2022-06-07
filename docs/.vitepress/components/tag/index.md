# Tag 标签

用于标记项展示。

## 组件注册

```js
import { FTag } from '@fesjs/fes-design';

app.use(FTag);
```

## 代码演示

### 基础用法

--BASIC

### 可移除标签

设置 `closable` 属性可以定义一个标签是否可移除。

--CLOSABLE

### 动态编辑标签

动态编辑标签可以通过点击标签关闭按钮后触发的 `close` 事件来实现

--EDIT

### 不同尺寸

Tag 组件提供了以下几种尺寸，可以在不同场景下选择合适的尺寸。

--SIZE

### 不同主题

Tag 组件提供了三个不同的主题。

--THEME

### 带图标

--WITHICON

### 结合 Form 组件

--WITHFORM

### 超长省略

--TOOLTIP

--CODE

## Tag Props

| 属性            | 说明                                                        | 类型    | 默认值    |
| --------------- | ----------------------------------------------------------- | ------- | --------- |
| type            | 类型，可选值为`default` `success` `info` `warning` `danger` | string  | `default` |
| closable        | 是否可关闭                                                  | boolean | `false`   |
| backgroundColor | 背景色                                                      | string  | —         |
| size            | 尺寸，可选值为 `small` `middle` `large`                     | string  | `middle`  |
| effect          | 主题，可选值为 `dark` `light` `plain`                       | string  | `light`   |
| bordered        | 是否有边框                                                  | boolean | `true`    |

## Tag Slots

| slot 名称 | 说明             |
| --------- | ---------------- |
| default   | 标签文本内容     |
| icon      | 标签文本左侧图标 |

## Tag Events

| 事件名称 | 说明                  | 回调参数 |
| -------- | --------------------- | -------- |
| click    | 点击 Tag 时触发的事件 | —        |
| close    | 关闭 Tag 时触发的事件 | —        |
