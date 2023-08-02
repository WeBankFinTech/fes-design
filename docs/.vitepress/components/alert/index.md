# Alert 警告提示

当需要用户对某一信息关注时，可通过警告提示组件来触达用户，常驻显示，或需要用户主动关闭

## 组件注册

```js
import { FAlert } from '@fesjs/fes-design';

app.use(FAlert);
```

## 代码演示

### 基础用法

提示类型主要分为：常规信息提醒、正确表达提醒、警示提醒、错误表达提醒

--COMMON

### 带图标

--WITHICON

### 带辅助信息

--DESCRIPTION

### 可关闭

--CANCLOSE

### 信息居中

--INFOCENTER

### 自定义

--SLOTCONTENT

--CODE

## Alert Props

| 属性        | 说明                                                                 | 类型                      | 默认值       |
| ----------- | -------------------------------------------------------------------- | ------------------------- | ------------ |
| type        | 指定警告提示的样式，有四种选择 `success`、`info`、`warning`、`error` | String                    | `info`       |
| message     | 提示内容                                                             | String                    | 无           |
| description | 辅助信息                                                             | String                    | 无           |
| showIcon    | 是否显示图标                                                         | Boolean                   | false        |
| closable    | 是否可以关闭                                                         | Boolean                   | false        |
| center      | 提示是否居中显示                                                     | Boolean                   | false        |
| beforeClose | 点击关闭按钮回调。返回 true 执行关闭                                 | `() => boolean / Promise` | `() => true` |

## Alert Slots

| 名称        | 说明     |
| ----------- | -------- |
| default     | 提示内容 |
| description | 辅助消息 |
| icon        | 图标     |
| action      | 操作     |
