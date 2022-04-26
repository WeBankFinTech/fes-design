# Message 消息

用户对某一操作结果的反馈，属于全局提示，不会针对具体元素，提示内容一般会自动消失，强度比警告提示弱一些

## 组件引用

```js
import { FMessage } from '@fesjs/fes-design';

FMessage.info('这是一条消息');
```

## 代码演示

### 基础用法

包括普通、成功、失败、警告信息。

--COMMON

### 可以关闭

显示关闭按钮，手动关闭和自动关闭都可以回调 afterClose

--CLOSE

### 自定义时长

自定义时长 `10s`，默认时长为`3s`。

--CLOSETIME

### 彩色样式

包括彩色的背景样式。

--COLOR

### 自定义消息内容

消息内容和图标都支持自定义`() => VNode`

--CONTENT

--CODE

## API

组件提供了一些静态方法，使用方式和参数如下

-   `message.success(content, [duration])`

-   `message.error(content, [duration])`

-   `message.info(content, [duration])`

-   `message.warning(content, [duration])`

-   `message.warn(content, [duration])` // alias of warning

| 参数     | 说明                                          | 类型                  | 默认值 |
| -------- | --------------------------------------------- | --------------------- | ------ |
| content  | 提示内容                                      | string ｜ () => VNode | -      |
| duration | 自动关闭的延时，单位秒，设置为 0 时不自动关闭 | number                | `3`    |

也可以对象的形式传递参数：

-   `message.success(config)`

-   `message.error(config)`

-   `message.info(config)`

-   `message.warning(config)`

-   `message.warn(config)` // alias of warning

| 参数       | 说明                                          | 类型                  | 默认值  |
| ---------- | --------------------------------------------- | --------------------- | ------- |
| content    | 提示内容                                      | string ｜ () => VNode | -       |
| duration   | 自动关闭的延时，单位秒，设置为 0 时不自动关闭 | number                | `3`     |
| icon       | 提示图标                                      | () => VNode           | -       |
| closable   | 是否显示关闭按钮                              | boolean               | `false` |
| colorful   | 是否是彩色样式                                | boolean               | -       |
| afterClose | 关闭后的回调，自动关闭和点击关闭都会回调      | Function              | -       |

## 全局方法

-   `message.config(options)`

-   `message.destroy()`

| 参数         | 说明                                                | 类型              | 默认值                |
| ------------ | --------------------------------------------------- | ----------------- | --------------------- |
| duration     | 全局默认自动关闭延时，单位秒，设置为 0 时不自动关闭 | number            | `3`                   |
| getContainer | 配置渲染节点的输出位置                              | () => HTMLElement | `() => document.body` |
| maxCount     | 最大显示数, 超过限制时，最早的消息会被自动关闭      | number            | -                     |
| top          | 消息距离顶部的位置                                  | string            | `24px`                |
| colorful     | 是否是彩色样式                                      | boolean           | `false`               |
