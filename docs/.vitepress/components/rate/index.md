# Rate 评分组件
评分组件用于评分行为

## 组件注册

```js
import { FRate } from '@fesjs/fes-design';

app.use(FRate);
```

## 代码演示

### 基础用法

:::demo
basic.vue
:::


### 尺寸
size属性给定了三种，`small`，`medium`，`large`

:::demo
size.vue
:::

### 颜色
可以自定义颜色，色号

:::demo
color.vue
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

### 事件监听
提供change，clear事件  
注意一点，clear事件也会触发change事件，只不过value为null

:::demo
event.vue
:::

## Props

| 属性        | 说明                                    | 类型       | 默认值   |
| ----------- | --------------------------------------- | ---------- | -------- |
| allowHalf   | 是否启用半星模式                        | `boolean`  | `false`  |
| colorFilled | 颜色填充风格                            | `boolean`  | `true`   |
| readonly    | 是否只读                                | `boolean`  | `false`  |
| count       | 图标个数                                | `number`   | `5`      |
| size        | 尺寸，可选值为 `small` `medium` `large` | `string`   | `medium` |
| color       | 颜色                                    | `string`   | `danger` |
| clearable   | 是否可以清除                            | `boolean`  | `false`  |
| texts       | 辅助文字                                | `string[]` | `-`      |
| showText    | 是否展示文字                            | `boolean`  | `false`  |

## Events

| 事件名称 | 说明                                  | 回调参数           |
| -------- | ------------------------------------- | ------------------ |
| change   | 在组件value值变更时触发               | (newValue) => void |
| clear    | `clearable` 属性生效，清空value时触发 | () => void         |

## Slots

| slot 名称 | 说明           |
| --------- | -------------- |
| content   | 自定义显示内容 |