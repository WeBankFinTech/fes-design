# Descriptions 描述列表

成组展示多个只读字段。

## 组件注册

```js
import { FDescriptions } from '@fesjs/fes-design';

app.use(FDescriptions);
```

## 代码演示

### 基础用法

--common

### label 在上方

--top

### 跨度

--span

### 边框

--CODE

## Props

### Descriptions Props

| 属性           | 说明                                    | 类型                    | 默认值 |
| -------------- | --------------------------------------- | ----------------------- | ------ |
| column         | 设置总列数                              | number                  | 3      |
| contentStyle   | 内容样式                                | string / object         | -      |
| labelAlign     | label 对齐方式                          | `left` `right` `center` | `left` |
| labelPlacement | label 位置                              | `top` `left`            | `left` |
| labelStyle     | label 样式                              | string / object         | -      |
| separator      | 分隔符，`labelPlacement` 为 `left` 有效 | string                  | ':'    |
| title          | 标题                                    | string                  | -      |
| bordered       | 边框                                    | boolean                 | false  |

### DescriptionItem Props

| 属性         | 说明       | 类型            | 默认值 |
| ------------ | ---------- | --------------- | ------ |
| contentStyle | 内容样式   | string / object | -      |
| label        | label 值   | string          | -      |
| labelStyle   | label 样式 | string / object | -      |
| span         | 所占列数   | number          | 1      |

## Slots

### Descriptions Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 描述内容 | `()` |
| header  | 描述标题 | `()` |

### DescriptionItem Slots

| 名称    | 说明            | 参数 |
| ------- | --------------- | ---- |
| default | 描述项内容      | `()` |
| label   | 描述项 label 值 | `()` |
