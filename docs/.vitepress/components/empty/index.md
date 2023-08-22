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

### 自定义样式

您可以通过 `css` 全局变量为 Empty 组件设置自定义样式。例如 `:root { --f-empty-font-size: 16px; --f-empty-text-color: #ccc; }` 等变量。 

### 默认变量

| Variable                | Color                         |
| ----------------------- | ----------------------------- |
| --f-empty-padding       | 30px 0                        |
| --f-empty-font-size     | var(--f-font-size-base)       |
| --f-empty-text-color    | var(--f-text-color-secondary) |
| --f-empty-description-margin-top | 16px                 |
| --f-empty-bottom-margin-top | 24px                      |


## API

### 属性 Attributes

| 属性名       | 描述                         | 类型      | 默认值 |
| ----------- | --------------------------- | --------- | ------- |
| image       | empty 组件的图像地址          | `string` | 默认图片  |
| image-size  | empty 组件的图像大小尺寸（宽度） | `number` | 无      |
| description | empty 组件的描述信息        | `string`   | ''      |

### 插槽  Slots

| 插槽名称     | 描述                       |
| ----------- | ------------------------- |
| default     | 作为底部内容的内容           |
| image       | 作为图像的内容              |
| description | 作为描述的内容              |
