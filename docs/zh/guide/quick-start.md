# 指引

`fes-design` 为 `vue3` 组件库，不支持 `vue2`。

## 安装

::: code-group

```bash [npm]
npm i @fesjs/fes-design
```

```bash [pnpm]
pnpm i @fesjs/fes-design
```

:::

## 在 SFC 中使用

```vue
<template>
    <FButton type="primary">Primary</FButton>
    <CloseCircleFilled />
</template>

<script setup>
import { FButton } from '@fesjs/fes-design';
import { CloseCircleFilled } from '@fesjs/fes-design/icon';
</script>
```

## 组件引入

### 全局部分导入

```js
import { FButton } from '@fesjs/fes-design';
app.use(FButton);
```

### 全局完整导入

```js
import FesDesign from '@fesjs/fes-design'
app.use(FesDesign)
```

### 手动导入

```vue
<template>
    <FButton>我是 FButton</FButton>
</template>
<script setup>
import { FButton } from '@fesjs/fes-design'
</script>
```

### 按需导入

以 Vite 为例。

```js
// vite.config.ts

import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
    // ...
    plugins: [
        Components({
            resolvers: [
                (componentName) => {
                    if (componentName.match(/^(F[A-Z]|f-[a-z])/)) {
                        return {
                            name: componentName,
                            from: '@fesjs/fes-design',
                        };
                    }
                },
            ],
        }),
    ],
});
```
