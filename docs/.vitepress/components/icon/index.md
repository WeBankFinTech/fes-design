# Icon 图标

## Icon 使用

点击具体 icon 可直接复制代码。

```vue
<template>
    <CloseCircleFilled />
</template>

<script setup>
import { CloseCircleFilled } from '@fesjs/fes-design/icon';
</script>
```

## Icons 列表

<IconDoc />

## 代码演示

### 基础用法

--COMMON

### 加载状态

--LOADING

### 自定义

--CUSTOM

--CODE

## Icon Props

| 属性     | 说明                       | 类型    | 默认值  |
| -------- | -------------------------- | ------- | ------- |
| spin     | 是否不停转动               | boolean | `false` |
| rotate   | 旋转                       | number  | `-`     |
| tabIndex | tabIndex，设置后会可被选中 | number  | `-`     |
| size     | 大小                       | number  | `-`     |
| color    | 颜色                       | string  | `-`     |
