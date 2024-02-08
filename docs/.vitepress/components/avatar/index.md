# Avatar 头像

Avatar 组件可以用来代表人物或对象， 支持使用图片、图标或者文字作为 Avatar。

## 组件注册

```js
import { FAvatar } from '@fesjs/fes-design';

app.use(FAvatar);
```

## 代码演示

### 基础用法
设定尺寸和形状，包裹文字的字号会根据内容自动调整

:::demo
base.vue
:::

### 颜色
设定头像背景颜色和文字颜色

:::demo
color.vue
:::

### 加载失败显示图像
通过`fallbackSrc`设置头像图片加载失败场景下的图片，可通过`error`函数设置图片加载失败时的回调  
如果没有设置`fallbackSrc`，src加载出错，则展示loading

:::demo
fallbackSrc.vue
:::

### 适应容器
当使用图片作为用户头像时，设置该图片如何在容器中展示，默认为fill。

:::demo
fit.vue
:::

### 头像组
可以通过包裹头像组件的方式，或者给头像组组件传递options方式，渲染头像组，优先渲染包裹的头像

:::demo
avatarGroup.vue
:::

### 展示hover信息

:::demo
showHoverTip.vue
:::

## Avatar Props

| 属性            | 说明                                                                    | 类型     | 默认值   |
| --------------- | ----------------------------------------------------------------------- | -------- | -------- |
| backgroundColor | 背景色                                                                  | `string` | `-`      |
| color           | 文字颜色                                                                | `string` | `-`      |
| shape           | 头像形状，可选值为`circle` `square`                                     | `string` | `circle` |
| src             | 图片地址                                                                | `string` | `-`      |
| fallbackSrc     | 失败图片地址                                                            | `string` | `-`      |
| size            | 尺寸                                                                    | `number` | `24`     |
| fit             | 图片适应容器方式，可选值为 `fill` `cover` `contain` `none` `scale-down` | `string` | `fill`   |


## AvatarGroup Props

| 属性         | 说明                                        | 类型      | 默认值   |
| ------------ | ------------------------------------------- | --------- | -------- |
| size         | 头像组统一尺寸                              | `number`  | `24`     |
| shape        | 头像形状，可选值为`circle` `square`         | `string`  | `circle` |
| max          | 最大展示头像数，超过的省略展示              | `number`  | `3`      |
| options      | 可以通过options传递包裹头像的属性，生成头像 | `array`   | `[]`     |
| showHoverTip | 是否hover展示name                           | `boolean` | `false`  |

## Avatar Events

| 事件名称 | 说明                          | 回调参数   |
| -------- | ----------------------------- | ---------- |
| error    | 在src属性加载的图片失败的回调 | () => void |