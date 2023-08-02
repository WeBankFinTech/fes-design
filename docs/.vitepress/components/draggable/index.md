# Draggable 拖拽

也许你需要拖拽排序

## 组件注册

```js
import { FDraggable } from '@fesjs/fes-design';

app.use(FDraggable);
```

## 代码演示

### 垂直方向

我们经常在垂直方向上拖动排序

--VERTICAL

### 水平方向

还可能在水平方向上拖动

--HORIZONTAL

### 多个容器

或许你需要由一个容器拖拽到另一个容器

--CONTAINER

### 拖拽指令

用指令更简单

--INSTRUCTION

### 拖拽指令-水平方向

指令也可以支持水平方向的

--INSTRUCTIONHORIZANTAL

### 拖拽指令-多个容器

指令当然也支持由一个容器拖拽到另一个容器

--INSTRUCTIONCONTAINER

### 阻止拖拽

当需要检查拖拽结果是否符合要求时，使用 beforeDragend，返回 false、Promise.resolve(false)、Promise.reject()时，拖拽会恢复之前的状态；

```ts
type BeforeDragEnd = (
    drag: {
        // 拖拽信息
        item: unknown;
        index: number;
        list: unknown[];
        resultList: unknown[]; // 拖拽结束预期结果
    },
    drop: {
        // 放置信息
        item: unknown;
        index: number;
        list: unknown[];
        resultList: unknown[];
    },
) => Promise<boolean> | boolean;
```

--CHECKDRAGEND

### 指令式阻止拖拽

--INSTRUCTIONCHECKDRAGEND

--CODE

## Draggable Props

| 属性          | 说明                                                                                           | 类型                         | 默认值     |
| ------------- | ---------------------------------------------------------------------------------------------- | ---------------------------- | ---------- |
| v-model       | 绑定值                                                                                         | Array                        | `[]`       |
| tag           | 指定 root dom 类型                                                                             | string                       | `div`      |
| disabled      | 是否禁用                                                                                       | boolean                      | `false`    |
| droppable     | 是否可以放置，设置为 droppable 的容器都可以相互拖拽放置                                        | boolean                      | `false`    |
| beforeDragend | 拖拽结束之前回调，返回 false、Promise.resolve(false)、Promise.reject()时，拖拽会恢复之前的状态 | [`BeforeDragEnd`](#阻止拖拽) | () => true |

## Draggable Events

| 事件名称  | 说明         | 回调参数                     |
| --------- | ------------ | ---------------------------- |
| dragstart | 拖拽开始触发 | (event, item, index) => void |
| dragend   | 拖拽结束触发 | (event, item, index) => void |

## Draggable Slots

| 名称    | 说明      | 属性              |
| ------- | --------- | ----------------- |
| default | item 内容 | `{ item, index }` |

## Draggable Directive

| 项               | 说明                                           |
| ---------------- | ---------------------------------------------- |
| 指令名称         | v-drag                                         |
| 值               | 绑定值 Array 类型                              |
| 修饰符 droppable | 是否可以放置其他容器的拖拽目标                 |
| 修饰符 disabled  | 是否禁用                                       |
| 参数             | Object，指令参数                               |
| -- beforeDragend | 拖拽结束之前回调，[`BeforeDragEnd`](#阻止拖拽) |
| -- onDragstart   | 拖拽开始触发                                   |
| -- onDragend     | 拖拽结束触发                                   |
