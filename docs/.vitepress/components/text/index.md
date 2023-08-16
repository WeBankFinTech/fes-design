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

### 尺寸

--SIZE

### 字体效果

--EFFECT

### 自定义元素标签

--TAG

### 混合使用

--MIXIN

--CODE

## Text Props

| 属性   | 说明                                                        | 类型    | 默认值    |
| ------ | ----------------------------------------------------------- | ------- | --------- |
| type   | 类型，可选值为`default` `success` `info` `warning` `danger` | string  | `default` |
| size   | 尺寸，可选值为`small` `middle` `large`                      | string  | `middle`  |
| strong | 是否字体加粗                                                | boolean | `false`   |
| italic | 是否字体倾斜                                                | boolean | `false`   |
| tag    | 自定义元素标签，可选值为`span` `div` `p` `h1` `h2` `h3` 等  | string  | `span`    |

## Text Slots

| slot 名称 | 说明     |
| --------- | -------- |
| default   | 默认内容 |
