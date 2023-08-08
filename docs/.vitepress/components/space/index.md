# Space 间距

给组件之间提供统一的间距。

## 组件注册

```js
import { FSpace } from '@fesjs/fes-design';

app.use(FSpace);
```

## 代码演示

### 基础用法

--BASIC

### 中间对齐

--JUSTIFYCENTER

### 尾部对齐

--END

### 垂直对齐

--VERTICAL

### space-between

--SPACEBETWEEN

### space-around

--SPACEAROUND

### 默认间距

--SIZE

### 自定义间距

--CUSTOMSIZE

### 对齐方式

--ALIGN

### 内联元素

--INLINE

--CODE

## Space Props

| 参数      | 说明                                                                                                                    | 类型                               | 默认值  |
| --------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------- |
| align     | 垂直排列方式，可选值为 `start` `end` `center` `baseline` `stretch` `flex-start` `flex-end`                              | string                             | -       |
| inline    | 是否为行内元素                                                                                                          | boolean                            | `false` |
| itemStyle | 节点样式                                                                                                                | string / object                    | -       |
| justify   | 水平排列方式，可选值为 `start` `end` `center` `space-around` `space-between` `start`                                    | string                             | `start` |
| size      | 为数字或字符串时，是垂直和水平间距；为数组时，是 [垂直间距, 水平间距]，字符串可选值为 `xsmall` `small` `middle` `large` | string / number / [number, number] | `small` |
| vertical  | 是否垂直布局                                                                                                            | boolean                            | `false` |
| wrap      | 是否超出换行                                                                                                            | boolean                            | `true`  |
