# Tree 树形控件

文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用树控件可以完整展现其中的层级关系，并具有展开收起选择等交互功能。

## 组件注册

```js
import { FTree } from '@fesjs/fes-design';

app.use(FTree);
```

## 代码演示

### 基础用法

基础的树形结构展示。

--COMMON

#### 叶子节点一行展示

--INLINE

#### 可选择多个节点

可以选择多个节点。

--MULTIPLE

### 可勾选

适用于需要选择层级时使用。

--CHECKABLE

#### 展开部分 + 默认选中 + 默认勾选

通过`expandedKeys`配置默认展开节点，通过`selectedKeys`配置默认选择节点，通过`checkedKeys`配置默认勾选节点。

--DEFAULT

#### 禁用节点

无法被选中和点击。

--ITEMDISABLED

### 异步加载

点击展开节点时加载子选项。

--ASYNC

### 搜索

通过关键字过滤树节点。

--FILTER

### 前缀与后缀

放一些操作。

--FIX

--CODE

## Tree Props

| 属性                  | 说明                                                                    | 类型                                      | 默认值     |
| --------------------- | ----------------------------------------------------------------------- | ----------------------------------------- | ---------- |
| data                  | 展示数据                                                                | Array\<TreeOption\>                       | `[]`       |
| multiple              | 支持点选多个节点（节点本身）                                            | boolean                                   | `false`    |
| accordion             | 手风琴模式，是否保持同级节点中只有一个节点展开                          | boolean                                   | `false`    |
| defaultExpandAll      | 是否默认展开所有节点，当有 `expandedKeys` 时，`defaultExpandAll` 将失效 | boolean                                   | `false`    |
| expandedKeys(v-model) | 展开的节点的 key 的数组                                                 | Array<string \| number>                   | `[]`       |
| checkable             | 节点前添加 `Checkbox` 复选框                                            | boolean                                   | `false`    |
| cascade             | `checkable` 状态下节点选择完全受控（父子节点选中状态关联）                                           | boolean                                   | `false`    |
| checkStrictly         | 设置勾选策略来指定勾选回调返回的值，`all` 表示回调函数值为全部选中节点；`parent` 表示回调函数值为父节点（当父节点下所有子节点都选中时）；`child` 表示回调函数值为子节点          | string                                   | `all`    |
| checkedKeys(v-model)  | 勾选的节点的 key 的数组                                                 | Array<string \| number>                   | `[]`       |
| selectable            | 是否可选中节点                                                              | boolean                                   | `true`     |
| selectedKeys(v-model) | 设置选中的树节点                                                        | Array<string \| number>                   | `[]`       |
| childrenField         | 替代 `TreeOption` 中的 `children` 字段名                                | string                                    | `children` |
| valueField            | 替代 `TreeOption` 中的 `value` 字段名                                   | string                                    | `value`    |
| labelField            | 替代 `TreeOption` 中的 `label` 字段名                                   | string                                    | `label`    |
| remote                | 是否异步获取选项，和 `onLoad` 配合                                      | boolean                                   | `false`    |
| loadData              | 异步加载数据的回调函数                                                  | (node: TreeOption) => Promise\<void\>     | `null`     |
| inline                | 底层节点是否横向排列                                                    | boolean                                   | `false`    |
| filterMethod          | 类似Array.filter函数，筛选树节点（高亮）                                      | (filterText, node: TreeOption) => Boolean | `null`     |

## Tree Events

| 事件名称 | 说明                | 回调参数                                          |
| -------- | ------------------- | ------------------------------------------------- |
| check    | 点击复选框触发      | ({ checkedKeys, node, event, checked }) => void   |
| expand   | 展开/收起节点时触发 | ({ expandedKeys, node, event, expanded }) => void |
| select   | 点击树节点触发      | ({ selectedKeys, node, event, selected }) => void |

## Tree Methods

| 方法名称   | 说明           | 参数         |
| ---------- | -------------- | ------------ |
| filter     | 过滤 Tree 节点 | (filterText) |
| selectNode | 选中节点       | (value)      |
| expandNode | 展开树节点     | (value)      |
| checkNode  | check 节点     | (value)      |

## TreeOption props

| 属性              | 说明                                                   | 类型                        | 默认值  |
| ----------------- | ------------------------------------------------------ | --------------------------- | ------- |
| value             | 节点的 `key`，需要唯一，可使用 `valueField` 修改字段名 | string / number             | `-`     |
| label             | 节点的内容，可使用 `labelField` 修改字段名             | string                      | `-`     |
| children?         | 节点的子节点                                           | TreeOption[]                | `[]`    |
| disabled?         | 是否禁用节点， 默认为`Tree`组件的`disabled`                                           | boolean                     | `-` |
| selectable? | 是否禁用选中节点，默认为`Tree`组件的`selectable`                          | boolean                     | `-` |
| checkable? | 是否禁用勾选节点，默认为`Tree`组件的`checkable`                          | boolean                     | `-` |
| isLeaf?           | 节点是否是叶节点，在 remote 模式下是必须的             | boolean                     | `false` |
| prefix?           | 节点的前缀                                             | string / (() => VNodeChild) | `null`  |
| suffix?           | 节点的后缀                                             | string / (() => VNodeChild) | `null`  |
