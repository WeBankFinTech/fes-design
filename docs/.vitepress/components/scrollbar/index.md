# Scrollbar

虚拟滚动条

## 组件注册

```js
import { FScrollbar } from '@fesjs/fes-design';

app.use(FScrollbar);
```

## 代码演示

### 滚动

--SCROLLBAR

### 横向滚动

--ROW

--CODE

## Props

| 属性                 | 说明                                                         | 类型                                   | 默认值  |
| -------------------- | ------------------------------------------------------------ | -------------------------------------- | ------- |
| height               | 内容高度                                                     | number/string                          | -       |
| maxHeight            | 内容最大高度                                                 | number/string                          | -       |
| native               | 是否使用原生滚动样式                                         | boolean                                | `false` |
| containerClass       | 包裹容器的自定义类名                                         | array/object/string                    | -       |
| containerStyle       | 包裹容器的自定义样式                                         | object/string                          | -       |
| contentStyle         | 内容容器的自定义样式                                         | object/string                          | -       |
| horizontalRatioStyle | 水平滚动条的自定义样式                                       | object/string                          | -       |
| verticalRatioStyle   | 垂直滚动条的自定义样式                                       | object/string                          | -       |
| noresize             | 不响应容器尺寸变化，如果容器尺寸不变，最好设置它可以优化性能 | boolean                                | `false` |
| always               | 总是显示滚动条                                               | boolean                                | `false` |
| minSize              | 滚动条滑块的最小尺寸                                         | number                                 | `20`    |
| shadow               | 显示待滚动区域阴影                                           | boolean / `{ x: boolean, y: boolean }` | `false` |

## Events

| 事件名称 | 说明     | 回调参数       |
| -------- | -------- | -------------- |
| scroll   | 滚动事件 | (event: Event) |

## Methods

| 事件名称      | 说明                                 | 参数                                           |
| ------------- | ------------------------------------ | ---------------------------------------------- |
| setScrollTop  | 设置 scrollTop, duration 为滚动动画  | (scrollTop: number, duration: Number) => void  |
| setScrollLeft | 设置 scrollLeft, duration 为滚动动画 | (scrollLeft: number, duration: Number) => void |
| update        | 手动更新滚动条                       | -                                              |
