# Switch 开关

表示两种相互对立的状态间的切换，多用于触发「开/关」。

## 组件注册

```js
import { FSwitch } from '@fesjs/fes-design';

app.use(FSwitch);
```

## 代码演示

### 基础用法

--COMMON

### 文字描述

--DEFAULT

### 扩展的 `value` 类型

--VALUE

### 禁用状态

--DISABLED

### 切换前判断

--BEFORECHANGE

### 尺寸

--SIZE

--CODE

## Switch Props

| 属性          | 说明                                                                        | 类型                                      | 默认值   |
| ------------- | --------------------------------------------------------------------------- | ----------------------------------------- | -------- |
| activeValue   | switch 打开时的值                                                           | boolean / string / array / object/ number | `true`   |
| beforeChange  | switch 状态改变前的钩子，返回 false 或者返回 Promise 且被 reject 则停止切换 | function                                  | -        |
| disabled      | 是否禁用                                                                    | boolean                                   | `false`  |
| inactiveValue | switch 关闭时的值                                                           | boolean / string / array / object/ number | `false`  |
| v-model       | 绑定值，必须等于 active-value 或 inactive-value，默认为 Boolean 类型        | boolean / string / array / object/ number | -        |
| size          | 大小，可选有'normal' 、 'small'                                             | string                                    | `normal` |

## Switch Events

| 事件名称 | 说明                            | 回调参数   |
| -------- | ------------------------------- | ---------- |
| change   | switch 状态发生变化后的回调函数 | 新状态的值 |

## Switch Slots

| 名称     | 说明               |
| -------- | ------------------ |
| active   | 激活时显示的内容   |
| inactive | 不激活时显示的内容 |
