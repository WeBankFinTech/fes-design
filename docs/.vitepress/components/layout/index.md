# Layout 布局

-   `Layout`：布局容器，其下可嵌套 `Header`、`Aside`、`Main`、`Footer` 或 `Layout` 本身，可以放在任何父容器中。**`Layout`默认是水平布局，当包含`Header`或者`Footer`时变为垂直布局**。
-   `Header`：顶部布局，自带默认样式，其下可嵌套任何元素，只能放在 `Layout` 中。
-   `Aside`：侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 `Layout` 中。
-   `Main`：内容部分，自带默认样式，其下可嵌套任何元素，只能放在 `Layout` 中。
-   `Footer`：底部布局，自带默认样式，其下可嵌套任何元素，只能放在 `Layout` 中。

## 组件注册

```js
import { FLayout } from '@fesjs/fes-design';

app.use(FLayout);
```

## 代码演示

### 侧边栏布局

#### 默认

<w-iframe height="300px" src="../../iframe/layout/default/index.html" />

#### 固定侧边栏

<w-iframe height="300px" src="../../iframe/layout/leftFixed/index.html" />

#### 固定侧边栏 + 可收起

<w-iframe height="300px" src="../../iframe/layout/collapsed/index.html" />

#### 固定侧边栏 + 自定义收起

<w-iframe height="300px" src="../../iframe/layout/f/index.html" />

#### 固定侧边栏 + 固定头部

<w-iframe height="300px" src="../../iframe/layout/topFixed/index.html" />



## Container Props

| 属性     | 说明                         | 类型    | 默认值 |
| -------- | ---------------------------- | ------- | ------ |
| embedded | 使用更深的背景色展现嵌入效果 | boolean | `true` |

## Header Props

| 属性  | 说明                                                                               | 类型    | 默认值  |
| ----- | ---------------------------------------------------------------------------------- | ------- | ------- |
| fixed | 是否固定住 Header，类似“position:fixed”效果，当`Container`区域滚动时，不会跟随滚动 | boolean | `false` |

## Aside Props

| 属性               | 说明                                                                                    | 类型    | 默认值  |
| ------------------ | --------------------------------------------------------------------------------------- | ------- | ------- |
| collapsible        | 侧边栏是否能够折叠                                                                      | boolean | `false` |
| collapsed(v-model) | 侧边栏是否折叠                                                                          | boolean | -       |
| collapsedWidth     | 侧边栏折叠后的宽度                                                                      | string  | 64px    |
| fixed              | 是否固定住侧边栏，当固定时 `position` 为 `fixed`，当`Container`区域滚动时，不会跟随滚动 | boolean | `false` |
| width              | 侧边栏宽度                                                                              | string  | 200px   |
| showTrigger        | 是否显示默认的折叠按钮                                                                  | boolean | `true`  |
