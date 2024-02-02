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

## Props

| 属性            | 说明                                                                    | 类型     | 默认值   |
| --------------- | ----------------------------------------------------------------------- | -------- | -------- |
| backgroundColor | 背景色                                                                  | `string` | `-`      |
| color           | 文字颜色                                                                | `string` | `-`      |
| shape           | 头像形状，可选值为`circle` `square`                                     | `string` | `circle` |
| src             | 图片地址                                                                | `string` | `-`      |
| fallbackSrc     | 失败图片地址                                                            | `string` | `-`      |
| size            | 尺寸                                                                    | `number` | `24`     |
| fit             | 图片适应容器方式，可选值为 `fill` `cover` `contain` `none` `scale-down` | `string` | `fill`   |


