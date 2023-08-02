# Menu 导航菜单

为网站提供导航功能的菜单。

## 组件注册

```js
import { FMenu } from '@fesjs/fes-design';

app.use(FMenu);
```

## 代码演示

### 水平方向

--COMMON

### 垂直方向

--VERTICAL

#### 折叠

收起菜单，只显示 `Icon`，留更多的空间展示页面内容。

--COLLAPSE

#### 只展开一个

展开子菜单，同时关闭其他子菜单。

--ACCORDION

#### 全部展开

--DEFAULTEXPANDALL

#### 展开部分

--EXPANDEDKEYS

### 配置方式

通过配置`options`直接生成菜单，比如可以通过路由数据生成菜单。

--OPTIONS

### 反色

显示反色主题。

--INVERTED

--CODE

## Menu Props

| 属性                  | 说明                                                                    | 类型            | 默认值       |
| --------------------- | ----------------------------------------------------------------------- | --------------- | ------------ |
| modelValue(v-model)   | 当前选中菜单标识符                                                      | string / number | `null`       |
| mode                  | 模式，可选值有`horizontal`和`vertical`                                  | string          | `horizontal` |
| collapsed             | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）                    | boolean         | `false`      |
| inverted              | 是否反转样式                                                            | boolean         | `false`      |
| defaultExpandAll      | 是否默认展开全部菜单，当有 `expandedKeys` 时，`defaultExpandAll` 将失效 | boolean         | `false`      |
| expandedKeys(v-model) | 展开的子菜单标识符数组                                                  | array           | `[]`         |
| accordion             | 是否只保持一个子菜单的展开                                              | boolean         | `false`      |
| options               | 菜单数据，配置可看 MenuOption                                           | array           | `[]`         |

## Menu Events

| 事件名称 | 说明           | 回调参数                   |
| -------- | -------------- | -------------------------- |
| select   | 选中菜单时触发 | ({ value: string}) => void |

## SubMenu Props

| 属性  | 说明         | 类型   | 默认值 |
| ----- | ------------ | ------ | ------ |
| value | 唯一标志     | string | `null` |
| label | 子菜单的标题 | string | `-`    |

## SubMenu Slots

| 属性  | 说明                                  |
| ----- | ------------------------------------- |
| icon  | 子菜单的 icon                         |
| label | 子菜单的标题，优先级比 props.label 高 |

## MenuGroup Props

| 属性  | 说明           | 类型   | 默认值 |
| ----- | -------------- | ------ | ------ |
| label | 分组菜单的标题 | string | `-`    |

## MenuGroup Slots

| 属性  | 说明                                    |
| ----- | --------------------------------------- |
| label | 分组菜单的标题，优先级比 props.label 高 |

## MenuItem Props

| 属性  | 说明       | 类型   | 默认值 |
| ----- | ---------- | ------ | ------ |
| value | 唯一标志   | string | `null` |
| label | 菜单的标题 | string | `-`    |

## MenuItem Slots

| 属性  | 说明                                |
| ----- | ----------------------------------- |
| icon  | 菜单的 icon                         |
| label | 菜单的标题，优先级比 props.label 高 |

## MenuOption

| 属性     | 说明                                           | 类型                      |
| -------- | ---------------------------------------------- | ------------------------- |
| value    | 菜单标识符                                     | string                    |
| label    | 菜单项的内容                                   | string 、 ()=> VNodeChild |
| icon     | 菜单项的图标                                   | ()=> VNodeChild           |
| children | 子选项，当存在子选项时渲染为子菜单或者分组菜单 | `Array<MenuOption>`       |
| isGroup  | 是否是分组                                     | boolean                   |
