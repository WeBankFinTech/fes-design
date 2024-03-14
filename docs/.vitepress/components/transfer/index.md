# Transfer 穿梭框

主要用于多组数据操作的场景中，当一组数据和另一组数据可以相互交换内容，或从一组数据选择其中部分数据组成一组新的数据组时，可使用穿梭框来实现。

## 组件注册

```js
import { FTransfer } from '@fesjs/fes-design';

app.use(FTransfer);
```

## 代码演示

### 基础用法

当内容只需单项穿梭时，可用此组件完成操作，此组件属于排列组合型

:::demo
basic.vue
:::

### 双向穿梭

当数据可进行相互交换时，可用此组件完成操作，此组件属于离散重组型

:::demo
twoWay.vue
:::

### 搜索

可在穿梭框中配置过滤条件

:::demo
filter.vue
:::

### 固定高度

指定 `height` 属性，固定组件高度

:::demo
height.vue
:::

### 树形结构

仅在单向穿梭框生效

:::demo
tree.vue
:::

### 自定义标签内容

:::demo
customLabel.vue
:::

## Props

| 属性       | 说明         | 类型                                                | 默认值  |
|------------|------------|-----------------------------------------------------|---------|
| v-model    | 选中的值     | `(string \| number)[]`                              | `[]`    |
| options    | 选项         | `TransferOption[]`                                  | `[]`    |
| twoWay     | 开启双向模式 | `boolean`                                           | `false` |
| filterable | 开启过滤     | `boolean`                                           | `false` |
| filter     | 过滤函数     | `(text: string, option: TransferOption) => boolean` | -       |
| height     | 固定高度     | `number`                                            | -       |

### TransferOption
| 属性      | 说明                 | 类型               | require |
|-----------|--------------------|--------------------|:-------:|
| value     | 选项的值             | `string \| number` |  必填   |
| label     | 选项的标签           | `string`           |  必填   |
| disabled  | 是否禁用             | `boolean`          |         |
| checkable | 是否显示 checkbox    | `boolean`          |         |
| children  | 子选项（用于树形结构） | `TransferOption[]` |         |

## Slots

| 名称  | 说明           | 参数                         |
|-------|--------------|------------------------------|
| label | 自定义标签内容 | `{ option: TransferOption }` |

## Events

| 事件名称 | 说明                            | 回调参数                              |
|----------|-------------------------------|---------------------------------------|
| change   | 因交互引起 v-model 值变化时触发 | `{ nextValue: (string \| number)[] }` |