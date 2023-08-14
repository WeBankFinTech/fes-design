# Text 文本

用于普通文本展示。

## 组件注册

```js
import { FText } from '@fesjs/fes-design';

app.use(FText);
```

## 代码演示

### 基础用法

--BASIC

### 更多效果

--EXTEND

--CODE

## Tag Props

| 属性   | 说明                                                        | 类型    | 默认值    |
| ------ | ----------------------------------------------------------- | ------- | --------- |
| type   | 类型，可选值为`default` `success` `info` `warning` `danger` | string  | `default` |
| strong | 是否字体加粗                                                | boolean | `false`   |
| italic | 是否字体倾斜                                                | boolean | `false`   |
| tag    | 元素标签，可选值为`span` `div` `p` `h1` `h2` `h3` 等        | string  | `span`    |

## Tag Slots

| slot 名称 | 说明     |
| --------- | -------- |
| default   | 文本内容 |
