# Text 文本

用于普通文本展示。

## 组件注册

```js
import { FText } from '@fesjs/fes-design';

app.use(FText);
```

## 代码演示

### 基础用法

:::demo
basic.vue
:::

### 尺寸

:::demo
size.vue
:::

### 字体效果

:::demo
effect.vue
:::

### 自定义元素标签

:::demo
tag.vue
:::

### 混合使用

:::demo
mixin.vue
:::

### 颜色渐变
通过`gradient`，可以设置文字的颜色渐变，纯色则form和to保持一致即可。

:::demo
gradient.vue
:::

## Text Props

| 属性     | 说明                                                        | 类型               | 默认值    |
| -------- | ----------------------------------------------------------- | ------------------ | --------- |
| type     | 类型，可选值为`default` `success` `info` `warning` `danger` | `string`           | `default` |
| size     | 尺寸，可选值为`small` `middle` `large`                      | `string`           | `middle`  |
| strong   | 是否字体加粗                                                | `boolean`          | `false`   |
| italic   | 是否字体倾斜                                                | `boolean`          | `false`   |
| tag      | 自定义元素标签，可选值为`span` `div` `p` `h1` `h2` `h3` 等  | `string`           | `span`    |
| gradient | 文本渐变色配置                                              | `Object<Gradient>` | `-`       |

## Text Slots

| slot 名称 | 说明     |
| --------- | -------- |
| default   | 默认内容 |

## Gradient Props 

| 属性 | 说明                              | 类型          | 默认值 |
| ---- | --------------------------------- | ------------- | ------ |
| from | 起始颜色                          | string        | `-`    |
| to   | 结束颜色                          | string        | `-`    |
| deg  | 渐变角度，默认为0，即从上之下渐变 | number/string | `0`    |