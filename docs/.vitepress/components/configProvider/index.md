# Config Provider 全局配置

为组件提供统一的全局化配置。
Config Provider 使用了 [Vue 的 provide/inject 特性](https://v3.vuejs.org/guide/composition-api-provide-inject.html#using-provide)。

## 组件注册

```js
import { FConfigProvider } from '@fesjs/fes-design';

app.use(FConfigProvider);
```

## 组件使用

### Props 方式配置

此配置优先级高于 API 方式。

#### 1. 弹窗挂载的 DOM 节点

```vue
<template>
    <f-config-provider :getContainer="getContainer">
        <app />
    </f-config-provider>
</template>

<script setup>
const getContainer = () => {
    return document.body;
};
</script>
```

### 2. 切换语言

--changeLocale

--CODE

### API 方式配置

```js
import { FConfigProvider } from '@fesjs/fes-design';

FConfigProvider.setConfig({
    getContainer: () => {
        return document.body;
    }
});
```

## Props

| 属性         | 说明                    | 类型              | 默认值                |
| ------------ | ----------------------- | ----------------- | --------------------- |
| getContainer | 指定弹窗挂载的 DOM 节点 | () => HTMLElement | `() => document.body` |
