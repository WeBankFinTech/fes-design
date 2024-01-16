# Rate 评分组件
评分组件用于评分行为

## 组件注册

```js
import { FRate } from '@fesjs/fes-design';

app.use(FRate);
```

## 代码演示

### 基础用法
提供两种空白的图标的样式，通过line-style区分，默认为实心star

:::demo
basic.vue
:::

### 个数
默认个数为5

:::demo
count.vue
:::

### 尺寸
size属性给定了三种，`small`，`medium`，`large`

:::demo
size.vue
:::

### 可清除
clearable默认为false，设置为true时点击当前value对应的图标可以将值置为null

:::demo
clearable.vue
:::

### 颜色
可以自定义颜色，色号

:::demo
color.vue
:::

### 只读
readonly默认为false，设置为true时，不可交互

:::demo
readonly.vue
:::

### 自定义图标
替换rate的图标icon

:::demo
customIcon.vue
:::

### 辅助文字
为组件设置 show-text 属性会在右侧显示辅助文字。 通过设置 texts 可以为每一个分值指定对应的辅助文字。  
texts 为一个数组，长度应等于评级图标个数。  
未匹配文字的评级，则不展示文字部分。

:::demo
text.vue
:::

### 半星
可以开启半星模式，默认情况下不开启

:::demo
half.vue
:::

## Props

| 属性      | 说明                                    | 类型       | 默认值   |
| --------- | --------------------------------------- | ---------- | -------- |
| value     | 值                                      | `number`   | `-`      |
| half      | 是否启用半星模式                        | `boolean`  | `false`  |
| lineStyle | 线性风格                                | `boolean`  | `false`  |
| readonly  | 是否只读                                | `boolean`  | `false`  |
| count     | 图标个数                                | `number`   | `5`      |
| size      | 尺寸，可选值为 `small` `medium` `large` | `string`   | `medium` |
| color     | 颜色                                    | `string`   | `danger` |
| clearable | 是否可以清除                            | `boolean`  | `false`    |
| texts     | 辅助文字                                | `string[]` | `-`      |
| showText  | 是否展示文字                            | `boolean`  | `false`  |

## Slots

| slot 名称 | 说明           |
| --------- | -------------- |
| content   | 自定义显示内容 |