# Tabs 标签页

当内容较多需要对内容进行分类，可使用标签页来展示各项分类内容，标签页和导航有点类似，只是在内容层级上有所区别，标签页属于更详细的内容分类

## 组件注册

```js
import { FTabs } from 'fes-design';

app.use(FTabs);
```

## 代码演示

### 基础用法

默认选中第一项。


--COMMON

### 禁用

禁用某一项。


--DISABLED


### 图标

有图标的标签。

--WITHICON


### 滚动

可以左右、上下滑动，容纳更多标签。

--WITHSCROLL
### 位置

指定标签的位置，position = 'left' | 'top' | 'right' | 'bottom'


--POSITION

### 卡片式页签

另一种样式的页签，仅支持 position = 'top'


--CARD

### 可关闭或增加页签

卡片式页签，设置了可删除后，hover 时显示删除按钮


--CLOSABLE

--CODE

## Tabs Props

| 属性       | 说明                                            | 类型            | 默认值  |
| ---------- | ----------------------------------------------- | --------------- | ------- |
| modelValue | 当前激活 tab 面板的 key                         | number / string | -       |
| position   | 页签位置，可选值有`left` `top` `right` `bottom` | string          | `top`   |
| type       | 页签的基本样式，可选`card` `line`               | string          | `line`  |
| closable   | 页签是否可关闭                                  | boolean         | `false` |

## Tabs Events

| 事件名称 | 说明                 | 回调参数         |
| -------- | -------------------- | ---------------- |
| close    | 页签关闭按钮点击回调 | Function(key) {} |

## Tabs Slots

| 名称    | 说明             |
| ------- | ---------------- |
| default | TabPane 页签面板 |

## TabPane Props

| 属性             | 说明                                                                                             | 类型            | 默认值  |
| ---------------- | ------------------------------------------------------------------------------------------------ | --------------- | ------- |
| value            | tab 的值                                                                                         | string / number | -       |
| name             | tab 的名称                                                                                       | string / number | -       |
| disabled         | 是否禁用                                                                                         | boolean         | `false` |
| closable         | 是否可关闭                                                                                       | boolean         | `false` |
| displayDirective | 选择性渲染使用的指令，if 对应 v-if，show 对应 v-show，使用 show 的时候标签页状态切换后不会被重置 | string          | `if`    |

## Tabs Slots

| 名称    | 说明              |
| ------- | ----------------- |
| default | TabPane 内容      |
| tab     | 标签项 tab 的内容 |
