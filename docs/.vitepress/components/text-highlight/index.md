# TextHighlight 文本高亮

用于高亮文本中的指定文字

## 组件注册

```js
import { FTextHighlight } from '@fesjs/fes-design';

app.use(FTextHighlight);
```

## 代码演示

### 基础用法

:::demo
base.vue
:::

### 自定义样式
可以自定义高亮样式

:::demo
markTextStyle.vue
:::

## TextHighlight Props

| 属性          | 说明                         | 类型                    | 默认值  |
| ------------- | ---------------------------- | ----------------------- | ------- |
| searchValues  | 搜索内容                     | `Array<string>`         | `[]`    |
| strict        | 严格模式，是否区分大小写匹配 | `boolean`               | `false` |
| markTextStyle | 自定义高亮样式               | `Object<CSSProperties>` | `-`     |

## TextHighlight slots

| slot 名称 | 说明           |
| --------- | -------------- |
| default   | 用户的文本内容 |