# 指引

`fes-design` 为 `vue3` 组件库，不支持 `vue2`。

## 安装

```bash
npm i @fesjs/fes-design
```

```bash
pnpm i @fesjs/fes-design
```

## 在 SFC 中使用

```vue
<template>
    <FButton type="primary">Primary</FButton>
    <CloseCircleFilled />
</template>

<script setup>
import {FButton} from '@fesjs/fes-design';
import {CloseCircleFilled} from '@fesjs/fes-design/icon';
</script>
```

## 按需

默认按需
