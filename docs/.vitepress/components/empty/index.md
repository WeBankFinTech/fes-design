# Empty 空数据

空数据时的占位提示。

## 组件注册

```js
import { FEmpty } from '@fesjs/fes-design';

app.use(FEmpty);
```

## 代码演示

### 基础用法

默认展示

--Default

### 自定义图片

通过设置 image 属性传入图片 URL。

--Custom

### 自定义图片大小

通过设置 image-size 属性来自定义图片大小

--Size

### 下拉选项场景

在其他组件中的应用

--Select

### 自定义底部内容

自定义底部插槽内容

--Bottom

--CODE


## API

### 属性 Attributes

| 属性名       | 描述                         | 类型      | 默认值   |
| ----------- | --------------------------- | --------- | ------- |
| image-src   | empty 组件的图像地址          | `string`  | -       |
| image-style | empty 组件的图像自定义样式     | `CSSProperties`  | -       |
| description | empty 组件的描述信息          | `string`  | -      |

### 插槽  Slots

| 插槽名称     | 描述                       |
| ----------- | ------------------------- |
| default     | 作为底部内容的内容           |
| image       | 作为图像的内容              |
| description | 作为描述的内容              |
