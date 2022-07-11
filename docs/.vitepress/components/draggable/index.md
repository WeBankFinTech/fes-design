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

--CODE

## Draggable Props

| 属性      | 说明                                                    | 类型    | 默认值  |
| --------- | ------------------------------------------------------- | ------- | ------- |
| disabled  | 是否禁用                                                | boolean | `false` |
| droppable | 是否可以放置，设置为 droppable 的容器都可以相互拖拽放置 | boolean | `false` |
| v-model   | 绑定值                                                  | Array   | `[]`    |

## Draggable Events

| 事件名称   | 说明                                              | 回调参数             |
| ---------- | ------------------------------------------------- | -------------------- |
| drag-start | 拖拽开始触发，可以修改 setting.draggable,阻止拖拽 | event，item，setting |
| drag-end   | 拖拽结束触发                                      | event，item          |

## Draggable Slots

| 名称    | 说明      | 属性            |
| ------- | --------- | --------------- |
| default | item 内容 | `{ item, index }` |

## Draggable Directive

| 名称   | 值                | 修饰符 droppable               | 修饰符 disabled |
| ------ | ----------------- | ------------------------------ | --------------- |
| v-drag | 绑定值 Array 类型 | 是否可以放置其他容器的拖拽目标 | 是否禁用        |
