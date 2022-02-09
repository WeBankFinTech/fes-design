# Skeleton 骨架屏

在需要等待加载内容的位置设置一个骨架屏，某些场景下比 Loading 的视觉效果更好。

## 组件注册

```js
import { FSkeleton } from '@fesjs/fes-design';

app.use(FSkeleton);
```

## 代码演示

### 基础用法

--BASIC

### 默认支持尺寸

--SIZE

### 自定义尺寸

--BOX

### 静态展示

--STATIC

### 自定义内容

--CUSTOM

--CODE

## Space Props

| 参数     | 说明                                        | 类型            | 默认值  |
| -------- | ------------------------------------------- | --------------- | ------- |
| text     | 是否文本骨架                                | boolean         | `false` |
| round    | 是否圆角骨架                                | boolean         | `false` |
| circle   | 是否圆形骨架                                | boolean         | `false` |
| height   | 骨架高度                                    | string / number | -       |
| width    | 骨架宽度                                    | string / number | -       |
| size     | 骨架大小，可选值为 `small` `middle` `large` | string          | -       |
| repeat   | 重复次数                                    | number          | `1`     |
| animated | 是否启用动画                                | `boolean`       | `true`  |
| sharp    | 是否显示为直角骨架                          | `boolean`       | `true`  |

## Space Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | 自定义内容 |
