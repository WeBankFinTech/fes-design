# Ellipsis 文本省略

## 组件注册

```js
import { FEllipsis } from '@fesjs/fes-design';

app.use(FEllipsis);
```

## 代码演示

### 基础用法

--COMMON

### 最大行数

--LINE

### 定制 Tooltip 内容

--TOOLTIP

--CODE

<style scoped>
.wrapper {
    margin-top: 20px;
    border: 1px solid #eee;
    padding: 20px;
}
</style>

## Ellipsis Props

| 属性    | 说明                                                                       | 类型             | 默认值 |
| ------- | -------------------------------------------------------------------------- | ---------------- | ------ |
| line    | 超出几行后省略                                                            | string / number  | `1`    |
| tooltip | 当文本隐藏时，通过`Tooltip`组件展示全部内容，默认延迟0.5s。 如果`tooltip`为 false，则禁止 | string | `-` |
| content | 文本内容 | boolean / object | `{showAfter: 500}` |

## Ellipsis Slots

| 名称    | 说明             |
| ------- | ---------------- |
| default | 文本内容，当使用插槽时无法监听内容变化而更新省略组件，推荐使用content属性            |
| tooltip | 自定义的 tooltip |
