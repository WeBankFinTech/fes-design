# Cascader 级联控件

文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用级联控件可以清晰展现其中的层级关系，并具有展开收起选择等交互功能。

## 组件注册

```js
import { FCascader } from '@fesjs/fes-design';

app.use(FCascader);
```

## 代码演示

### 基础用法

基础的树形结构展示。

--COMMON

#### 可选择多个节点

可以选择多个节点。

--MULTIPLE

### 可勾选

适用于需要选择层级时使用。

--CHECKABLE

#### 默认展开 + 默认选中 + 默认勾选

> 默认配置并不会做校验处理，比如`cascade = true`的时候，默认仅勾选父节点，子节点并不会自动勾选。

-   通过`expandedKeys`配置默认展开节点；
-   通过`selectedKeys`配置默认选择节点；
-   通过`checkedKeys`配置默认勾选节点；

--DEFAULT

#### 禁用节点

无法被选中和点击。

--ITEMDISABLED

### 异步加载

点击展开节点时加载子选项。

--ASYNC

### 前缀与后缀

放一些附加展示或操作。

--FIX

### 文字超长溢出

--LONGLABEL

--CODE

## Cascader Props

| 属性                  | 说明                                                                                                                                                                                                                      | 类型                                                          | 默认值     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------- |
| data                  | 展示数据                                                                                                                                                                                                                  | Array\<CascaderOption\>                                       | `[]`       |
| expandedKeys(v-model) | 展开的节点的 key 的数组                                                                                                                                                                                                   | Array<string \| number>                                       | `[]`       |
| selectable            | 是否可选中节点                                                                                                                                                                                                            | boolean                                                       | `true`     |
| selectedKeys(v-model) | 设置选中的节点                                                                                                                                                                                                            | Array<string \| number>                                       | `[]`       |
| multiple              | 是否能选中多个节点                                                                                                                                                                                                        | boolean                                                       | `false`    |
| cancelable            | 选中后是否可以再次点击取消选中                                                                                                                                                                                            | boolean                                                       | `true`     |
| checkable             | 是否显示 `Checkbox` 选择框                                                                                                                                                                                                | boolean                                                       | `false`    |
| cascade               | 当勾选选择框时，父子节点的选择框勾选状态是否关联，相互影响                                                                                                                                                                | boolean                                                       | `true`     |
| checkStrictly         | 设置勾选策略来指定勾选回调返回的值。多选时，`all` 表示回调函数值为全部选中节点；`parent` 表示回调函数值为父节点（当父节点下所有子节点都选中时）；`child` 表示回调函数值为子节点。单选时，`all` 表示回调函数值可为父节点。 | string                                                        | `child`    |
| checkedKeys(v-model)  | 勾选节点 key 的数组                                                                                                                                                                                                       | Array<string \| number>                                       | `[]`       |
| childrenField         | 替代 `CascaderOption` 中的 `children` 字段名                                                                                                                                                                              | string                                                        | `children` |
| valueField            | 替代 `CascaderOption` 中的 `value` 字段名                                                                                                                                                                                 | string                                                        | `value`    |
| labelField            | 替代 `CascaderOption` 中的 `label` 字段名                                                                                                                                                                                 | string                                                        | `label`    |
| remote                | 是否异步获取选项，和 `loadData` 配合                                                                                                                                                                                      | boolean                                                       | `false`    |
| loadData              | 异步加载数据的回调函数                                                                                                                                                                                                    | (node: null \| CascaderOption) => Promise\<CascaderOption[]\> | -          |
| expandTrigger         | 次级菜单的展开方式，可选值为 `click`,`hover`                                                                                                                                                                              | string                                                        | `click`    |

## Cascader Events

| 事件名称 | 说明                     | 回调参数                                          |
| -------- | ------------------------ | ------------------------------------------------- |
| check    | 点击节点中的选择框时触发 | ({ checkedKeys, node, event, checked }) => void   |
| expand   | 展开、收起节点时触发     | ({ expandedKeys, node, event, expanded }) => void |
| select   | 点击节点内容时触发       | ({ selectedKeys, node, event, selected }) => void |

## Cascader Methods

| 方法名称   | 说明       | 参数    |
| ---------- | ---------- | ------- |
| selectNode | 选中节点   | (value) |
| expandNode | 展开树节点 | (value) |
| checkNode  | check 节点 | (value) |

## CascaderOption props

| 属性        | 说明                                                   | 类型                        | 默认值  |
| ----------- | ------------------------------------------------------ | --------------------------- | ------- |
| value       | 节点的 `key`，需要唯一，可使用 `valueField` 修改字段名 | string / number             | `-`     |
| label       | 节点的内容，可使用 `labelField` 修改字段名             | string                      | `-`     |
| children?   | 节点的子节点                                           | CascaderOption[]            | `[]`    |
| disabled?   | 是否禁用节点， 默认为`Cascader`组件的`disabled`        | boolean                     | `-`     |
| selectable? | 是否禁用选中节点，默认为`Cascader`组件的`selectable`   | boolean                     | `-`     |
| checkable?  | 是否禁用勾选节点，默认为`Cascader`组件的`checkable`    | boolean                     | `-`     |
| isLeaf?     | 节点是否是叶节点，在 remote 模式下是必须的             | boolean                     | `false` |
| prefix?     | 节点的前缀                                             | string / (() => VNodeChild) | `null`  |
| suffix?     | 节点的后缀                                             | string / (() => VNodeChild) | `null`  |
