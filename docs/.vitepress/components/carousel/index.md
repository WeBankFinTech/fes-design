# Carousel 走马灯

旋转木马，一组轮播的区域。

## 组件注册

```js
import { FCarousel } from 'fes-design';

app.use(FCarousel);
```

## 代码演示

### 基础用法

--Default

### 指示器

--Indicator

--CODE

## Carousel Props（属性）

| 属性               | 说明                                  | 类型    | 可选值              | 默认值     |
| :----------------- | :------------------------------------ | :------ | :------------------ | :--------- |
| height             | carousel 的高度                       | string  | —                   | —          |
| initial-index      | 初始状态激活的幻灯片的索引，从 0 开始 | number  | —                   | 0          |
| trigger            | 指示器的触发方式                      | string  | hover/click         | hover      |
| autoplay           | 是否自动切换                          | boolean | —                   | true       |
| interval           | 自动切换的时间间隔，单位为毫秒        | number  | —                   | 3000       |
| indicator-type | 指示器的位置                          | string  | linear/dot        | linear          |
| indicator-placement | 指示器的摆放方向                     | string  | top/right/bottom/left       | —bottom |
| indicator-position | 指示器的位置                          | string  | outside/none        | —          |
| show-arrow         | 切换箭头的显示时机                    | string  | always/hover/never  | hover      |
| type               | carousel 的类型                       | string  | card                | —          |
| loop               | 是否循环显示                          | boolean | -                   | true       |
| pause-on-hover     | 鼠标悬浮时暂停自动切换                | boolean | -                   | true       |

## Carousel Events（事件）

| 事件名 | 说明             | 回调参数                               |
| :----- | :--------------- | :------------------------------------- |
| change | 幻灯片切换时触发 | 目前激活的幻灯片的索引，原幻灯片的索引 |

## Carousel Methods（方法）

| 方法名        | 说明               | 参数                                                         |
| :------------ | :----------------- | :----------------------------------------------------------- |
| setActiveItem | 手动切换幻灯片     | 需要切换的幻灯片的索引，从 0 开始                                   |
| prev          | 切换至上一张幻灯片 | —                                                            |
| next          | 切换至下一张幻灯片 | —                                                            |

## Carousel Slots（插槽）

| 插槽名 | 说明           | 子标签        |
| :----- | :------------- | :------------ |
| -      | 自定义默认内容 | Carousel-Item |


## Carousel-Item Slots（插槽）

| 插槽名 | 说明           |
| :----- | :------------- |
| —      | 自定义默认内容 |
