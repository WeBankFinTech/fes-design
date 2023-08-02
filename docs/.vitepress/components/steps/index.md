# Steps 步骤条

拆分某项流程的步骤，引导用户按流程完成任务。

## 组件注册

```js
import { FSteps } from '@fesjs/fes-design';

app.use(FSteps);
```

## 代码演示

### 基础用法

--COMMON

### 垂直方向

--VERTICAL

### 图标

--ICON

### 错误状态

--ERROR

--CODE

## Steps Props

| 属性             | 说明                                                                 | 类型    | 默认值      |
| ---------------- | -------------------------------------------------------------------- | ------- | ----------- |
| current(v-model) | 指定当前步骤                                                         | number  | `undefined` |
| status           | 指定当前步骤的状态，可选 `wait`、`process`、`finish`、`error`        | string  | `process`   |
| type             | 步骤条类型，有 `default` 和 `navigation` 两种, 第一期就支持`default` | string  | `default`   |
| vertical         | 是否垂直方向                                                         | boolean | `false`     |
| initial          | 起始序号                                                             | number  | `1`         |

## Steps Events

| 事件名称 | 说明               | 回调参数        |
| -------- | ------------------ | --------------- |
| change   | 点击切换步骤时触发 | (current)=>void |

## Step Props

| 属性        | 说明                                                                                                           | 类型          | 默认值 |
| ----------- | -------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| description | 步骤的详情描述，可选                                                                                           | string / slot | -      |
| icon        | 步骤图标的类型，可选                                                                                           | slot          | -      |
| status      | 指定状态。当不配置该属性时，会使用 `Steps` 的 `status` 来自动指定状态。可选：`wait` `process` `finish` `error` | string        | -      |
| title       | 标题                                                                                                           | string / slot | -      |
