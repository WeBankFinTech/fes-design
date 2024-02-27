# Avatar 头像

Avatar 组件可以用来代表人物或对象， 支持使用图片、图标或者文字作为 Avatar。

## 组件注册

```js
import { FAvatar } from '@fesjs/fes-design';

app.use(FAvatar);
```

## 代码演示

### 基础用法
设定尺寸和形状

:::demo
base.vue
:::

### 颜色&字号
设定头像背景颜色和文字颜色，包裹文字的字号会根据内容自动调整

:::demo
color.vue
:::

### 加载失败显示图像
通过`fallbackSrc`设置头像图片加载失败场景下的图片，可通过`error`函数设置图片加载失败时的回调  
如果没有设置`fallbackSrc`，src加载出错，则展示我们设置的兜底icon  
当设置的`fallbackSrc`也加载出错，同样展示兜底icon

:::demo
fallbackSrc.vue
:::

### 适应容器
当使用图片作为用户头像时，设置该图片如何在容器中展示，默认为fill。

:::demo
fit.vue
:::

### 头像组
可以通过包裹头像组件的方式，或者给头像组组件传递options方式，渲染头像组  
优先渲染包裹的头像

:::demo
avatarGroup.vue
:::


## Avatar Props

| 属性            | 说明                                                                                               | 类型                | 默认值   |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------------- | -------- |
| backgroundColor | 背景色                                                                                             | `string`            | `-`      |
| color           | 文字颜色                                                                                           | `string`            | `-`      |
| shape           | 头像形状，可选值为`circle` `square`                                                                | `string`            | `circle` |
| src             | 图片地址                                                                                           | `string`            | `-`      |
| fallbackSrc     | 失败图片地址                                                                                       | `string`            | `-`      |
| size            | 尺寸，可选 `small`   `middle`  `large` ，或者指定具体的数值，单位为px                              | `string` / `number` | `middle` |
| fit             | 确定图片如何适应容器框，同原生 `object-fit`，可选值为 `fill` `contain` `cover` `none` `scale-down` | `string`            | `fill`   |


## AvatarGroup Props

| 属性          | 说明                                                                            | 类型                  | 默认值   |
| ------------- | ------------------------------------------------------------------------------- | --------------------- | -------- |
| size          | 头像组统一尺寸，可选 `small`   `middle`  `large` ，或者指定具体的数值，单位为px | `string` / `number`   | `middle` |
| shape         | 头像形状，可选值为`circle` `square`                                             | `string`              | `circle` |
| max           | 最大展示头像数，超过的省略展示                                                  | `number`              | `3`      |
| options       | 可以通过options传递包裹头像的属性，生成头像                                     | `Array<AvatarOption>` | `[]`     |
| expandOnHover | 悬停时展开                                                                      | `boolean`             | `false`  |

## AvatarOption Props

| 属性 | 说明                 | 类型     | 默认值 |
| ---- | -------------------- | -------- | ------ |
| name | 头像悬停展示的信息   | `string` | `-`    |
| src  | 头像图片地址         | `string` | `-`    |
| text | 文字内容作为头像     | `string` | `-`    |
| icon | icon库中图标作为头像 | `string` | `-`    |

## Avatar Events

| 事件名称 | 说明                          | 回调参数   |
| -------- | ----------------------------- | ---------- |
| error    | 在src属性加载的图片失败的回调 | () => void |