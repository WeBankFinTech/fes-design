# InputFile 文件选择

## 组件注册

```js
import { FInputFile } from '@fesjs/fes-design';

app.use(FInputFile);
```

## 代码演示

### 基础用法

:::demo
basic.vue
:::

### 拖放文件

:::demo
dragAndDrop.vue
:::

## Props
| 属性     | 说明             | 类型       | 默认值  |
|----------|----------------|------------|---------|
| v-model  | 选择的文件       | `File[]`   | `[]`    |
| multiple | 是否支持多选文件 | `boolean`  | `false` |
| accept   | 接受的文件类型   | `string[]` | `[]`    |
| disabled | 是否禁用         | `boolean`  | `false` |

## Events

| 事件名称 | 说明           | 回调参数                  |
|----------|--------------|---------------------------|
| change   | 选择文件后调用 | `(files: File[]) => void` |

## Slots

| 名称     | 说明                 | 参数        |
|----------|--------------------|-------------|
| default  | 触发文件选择框的内容 | -           |
| fileList | 自定义选中文件的展示 | `{ files }` |

## InputFileDragger Props

| 属性              | 说明                                                                 | 类型                      | 默认值 |
|-------------------|--------------------------------------------------------------------|---------------------------|--------|
| onFileTypeInvalid | 拖拽文件类型不满足 `accept` 时的钩子函数，<br/>若未定义则使用内置提示 | `(files: File[]) => void` | -      |