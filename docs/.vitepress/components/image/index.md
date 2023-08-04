# image 图片

## 组件注册

```js
import { FImage, FPreviewGroup } from '@fesjs/fes-design';

app.use(FImage);
app.use(FPreviewGroup);
```

## 图片的使用

图片组件即图片容器，承载的内容只能为图片类型的内容，可定义支持多种图片格式，jpg、png 等

### 基础用法

--COMMON

### 容器适应

可通过 fit 确定图片如何适应到容器框，同原生 object-fit。

--FIT

### 占位内容

--PLACEHOLDER

### 容错处理

--ERROR

### 懒加载

--LAZY

### 图片预览

单张图片预览：

--PREVIEW

多张图片预览：

--MULTIPREVIEW

--CODE

## Image Props

| 属性             | 说明                                                                                               | 类型                 | 默认值                |
| ---------------- | -------------------------------------------------------------------------------------------------- | -------------------- | --------------------- |
| alt              | 图像描述                                                                                           | string               | `-`                   |
| width            | 图像宽度                                                                                           | string/number        | `-`                   |
| height           | 图像高度                                                                                           | string/number        | `-`                   |
| src              | 图片地址                                                                                           | string               | `-`                   |
| preview          | 预览参数，为 false 时禁用                                                                          | boolean              | `false`               |
| fit              | 确定图片如何适应容器框，同原生 `object-fit`，可选值为 `fill` `contain` `cover` `none` `scale-down` | string               | `fill`                |
| lazy             | 是否开启懒加载                                                                                     | boolean              | `-`                   |
| hideOnClickModal | 是否可以通过点击遮罩层关闭预览                                                                     | boolean              | `false`               |
| scrollContainer  | 开启懒加载后，监听 scroll 事件的容器                                                               | string / HTMLElement | `-`                   |
| previewContainer | 指定预览弹窗挂载的 HTML 节点                                                                       | () => HTMLElement    | `() => document.body` |
| name             | 当配置名称时，预览会展示此名称                                                                     | string               | `-`                   |
| download         | 是否可以下载，下载文件名称使用`name`                                                               | boolean              | `false`               |

## Image Events

| 事件名称 | 说明             | 回调参数   |
| -------- | ---------------- | ---------- |
| load     | 图片加载成功触发 | (e: Event) |
| error    | 图片加载失败触发 | (e: Error) |

## Image Slots

| 名称        | 说明                 |
| ----------- | -------------------- |
| placeholder | 图片未加载的占位内容 |
| error       | 加载失败的内容       |

## ImageGroup Props

| 属性             | 说明                           | 类型    | 默认值  |
| ---------------- | ------------------------------ | ------- | ------- |
| hideOnClickModal | 是否可以通过点击遮罩层关闭预览 | boolean | `false` |

## ImageGroup Events

| 事件名称 | 说明               | 回调参数         |
| -------- | ------------------ | ---------------- |
| change   | 当前图片切换时触发 | (current)=>void) |

## ImageGroup Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | Image 组件 |
