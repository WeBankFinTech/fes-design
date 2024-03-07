# Progress 进度条

展示当前任务进度，将进度可视化

## 组件注册

```js
import { FProgress } from '@fesjs/fes-design';

app.use(FProgress);
```

## 代码演示

### 基础用法
水平进度条，进度条宽度占满父组件。   
需要注意水平进度条百分比內显，需要height大于等于12px。

:::demo
base.vue
:::

### 文案插槽
在条形进度条场景下，代替外显的百分比展示。注意前提是要开启外显百分比。  
环形进度条场景，需要开启showCircleText。

:::demo
textSlot.vue
:::


## Props

| 属性             | 说明                                               | 类型      | 默认值  |
| ---------------- | -------------------------------------------------- | --------- | ------- |
| type             | 进度条类型，可选值为 'line' 或 'circle'            | `string`  | `line`  |
| percent          | 进度百分比                                         | `number`  | `0`     |
| color            | 进度条颜色                                         | `string`  | `-`     |
| showInnerPercent | 是否在进度条内部显示百分比（仅在type为line生效）   | `boolean` | `false` |
| showOutPercent   | 是否在进度条外部显示百分比（仅在type为line生效）   | `boolean` | `false` |
| height           | 进度条高度（仅在type为line生效）                   | `number`  | `8`     |
| width            | 进度条宽度（仅在type为circle生效）                 | `number`  | `8`     |
| circleSize       | 环形进度条的直径大小（仅在type为circle生效）       | `number`  | `160`   |
| showCircleText   | 是否在环形进度条中显示文本（仅在type为circle生效） | `boolean` | `false` |


## Slots

| slot 名称 | 说明                   |
| --------- | ---------------------- |
| text      | 自定义文本部分显示内容 |
