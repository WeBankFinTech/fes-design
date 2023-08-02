# Carousel 走马灯

旋转木马，一组轮播的区域。

## 组件注册

```js
import { FCarousel } from '@fesjs/fes-design';

app.use(FCarousel);
```

## 代码演示

### 基础用法

默认展示

--Default

### 鼠标经过指示点切换轮播图

设定 `trigger` 为 `hover` 鼠标经过指示点时触发切换。

--Hover

### 指示器类型和显示区域

可以设置指示器类型和显示区域，以及摆放方位，比如圆点、或者放置在轮播图区域外部 or 隐藏。

--Indicator

### 指示器位置

更改指示器位置，分别有 `top/right/bottom/left` 4 个方向。

--Placement

### 显示切换箭头

可以设置切换箭头的显示时机
`arrow` 属性定义了切换箭头的显示时机。 默认情况下，切换箭头只有在鼠标 `hover` 到走马灯上时才会显示。 若将 `arrow` 设置为 `always`，则会一直显示；设置为 `never`，则会一直隐藏。

--Arrow

### 卡片

当页面宽度方向空间空余，但高度方向空间匮乏时，可使用卡片风格
将 `type` 属性设置为 `card` 即可启用卡片模式。 从交互上来说，卡片模式和一般模式的最大区别在于，卡片模式可以通过直接点击两侧的幻灯片进行切换。

--Card

--CODE

## Carousel Props（属性）

| 属性                | 说明                                  | 类型    | 可选值                | 默认值 |
| :------------------ | :------------------------------------ | :------ | :-------------------- | :----- |
| height              | carousel 的高度                       | string  | —                     | —      |
| initial-index       | 初始状态激活的幻灯片的索引，从 0 开始 | number  | —                     | 0      |
| trigger             | 指示器的触发方式                      | string  | click/hover           | click  |
| autoplay            | 是否自动切换                          | boolean | —                     | true   |
| interval            | 自动切换的时间间隔，单位为毫秒        | number  | —                     | 3000   |
| indicator-type      | 指示器的类型（线性/圆点）             | string  | linear/dot            | linear |
| indicator-placement | 指示器的摆放方向                      | string  | top/right/bottom/left | bottom |
| indicator-position  | 指示器的位置                          | string  | outside/none          | —      |
| show-arrow          | 切换箭头的显示时机                    | string  | always/hover/never    | hover  |
| type                | carousel 的类型                       | string  | card                  | —      |
| loop                | 是否循环显示                          | boolean | -                     | true   |
| pause-on-hover      | 鼠标悬浮时暂停自动切换                | boolean | -                     | true   |

## Carousel Events（事件）

| 事件名 | 说明             | 回调参数                               |
| :----- | :--------------- | :------------------------------------- |
| change | 幻灯片切换时触发 | 目前激活的幻灯片的索引，原幻灯片的索引 |

## Carousel Methods（方法）

| 方法名        | 说明               | 参数                              |
| :------------ | :----------------- | :-------------------------------- |
| setActiveItem | 手动切换幻灯片     | 需要切换的幻灯片的索引，从 0 开始 |
| prev          | 切换至上一张幻灯片 | —                                 |
| next          | 切换至下一张幻灯片 | —                                 |

## Carousel Slots（插槽）

| 插槽名  | 说明     | 子标签        |
| :------ | :------- | :------------ |
| default | 默认插槽 | FCarouselItem |

## Carousel-Item Slots（插槽）

| 插槽名  | 说明           |
| :------ | :------------- |
| default | 自定义标签内容 |
