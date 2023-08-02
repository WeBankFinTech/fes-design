# Collapse 折叠面板

通过折叠面板收纳内容区域

## 组件注册

```js
import { FCollapse } from 'fes-design';

app.use(FCollapse);
```

## 基础用法

可同时展开多个面板，面板之间不影响

--BASIC

## 手风琴效果

每次只能展开一个面板

通过 `accordion` 属性来设置是否以手风琴模式显示。

--ACCORDION

## 箭头在左边

箭头在左边配置

--ARROWLEFT

## 背景色

embedded 控制背景色

--EMBEDDED

## 自定义面板标题

除了可以通过 `title` 属性以外，还可以通过具名 `slot` 来实现自定义面板的标题内容，以实现增加图标等效果。

--CUSTOMIZATION

--CODE

## Collapse 属性

| 属性名                | 详情                                                                    | 类型                                                 | 可选值 | 默认值 |
| --------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- | ------ | ------ |
| model-value / v-model | 当前激活的面板(如果是手风琴模式，绑定值类型需要为 string，否则为 array) | string (accordion mode) / array (non-accordion mode) | —      | —      |
| accordion             | 是否手风琴模式                                                          | boolean                                              | —      | false  |
| arrow                 | 箭头位置 ( left, right ) ，默认右边                                     | string                                               | —      | right  |
| embedded              | 内容使用更深的背景色展现嵌入效果                                        | boolean                                              | —      | true   |

## Collapse 事件

| 属性名 | 说明                                                                                   | 回调参数                                                            |
| ------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| change | 当前激活面板改变时触发(如果是手风琴模式，参数 activeNames 类型为 string，否则为 array) | (activeNames: array (non-accordion mode) / string (accordion mode)) |

## Collapse 插槽

| 插槽名 | 内容           | 子标签 |
| ------ | -------------- | ------ |
| -      | 自定义默认内容 | 折叠项 |

## Collapse Item 属性

| 属性名   | 说明       | 类型          | 可选值 | 默认值 |
| -------- | ---------- | ------------- | ------ | ------ |
| name     | 唯一标志符 | string/number | —      | —      |
| title    | 面板标题   | string        | —      | —      |
| disabled | 是否禁用   | boolean       | —      | —      |

## Collapse Item 插槽

| 属性名 | 说明             |
| ------ | ---------------- |
| —      | 折叠项的内容     |
| title  | 折叠项标题的内容 |
