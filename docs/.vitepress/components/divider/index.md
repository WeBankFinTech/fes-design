# Divider 分割线

分割一些内容。

## 组件注册

```js
import { FDivider } from '@fesjs/fes-design';

app.use(FDivider);
```

## 代码演示

### 基础用法

--COMMON

### 附带文字

--TEXT

### 垂直方向

--VERTICAL

--CODE

## Props

| 属性           | 说明                                             | 类型    | 默认值   |
| -------------- | ------------------------------------------------ | ------- | -------- |
| vertical       | 是否是垂直方向                                   | boolean | `false`  |
| titlePlacement | 设置文字的位置，可选有 `center`、`left`、`right` | string  | `center` |

## Slots

| slot 名称 | 说明 |
| --------- | ---- |
| default   | 文字 |
