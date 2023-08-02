# Spin 加载中

用于页面和区块的加载中状态。

## 组件注册

```js
import { FSpin } from '@fesjs/fes-design';

app.use(FSpin);
```

## 代码演示

### 基础用法

--COMMON

### 颜色

--COLOR

### 卡片加载中

--LOADING

### 各种大小

--SIZE

--CODE

## Spin Props

| 属性        | 说明                                             | 类型    | 默认值   |
| ----------- | ------------------------------------------------ | ------- | -------- |
| size        | 大小，可选有`small`、`middle`、`large`           | string  | `middle` |
| description | 描述                                             | string  | -        |
| stroke      | 颜色                                             | string  | -        |
| show        | 是否显示                                         | boolean | `true`   |
| delay       | 延迟多少毫秒显示，用于防止页面加载过快导致的闪烁 | number  | `0`      |

## Spin Slots

| 名称        | 说明                              |
| ----------- | --------------------------------- |
| default     | 如果填入，`Spin` 会包裹填入的内容 |
| icon        | 自定义加载图标                    |
| description | 描述信息                          |
