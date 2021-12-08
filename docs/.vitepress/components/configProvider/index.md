# Config Provider 全局配置

为组件提供统一的全局化配置。

## 使用

### 组件方式

1. 注册组件

```js
import { FConfigProvider } from 'fes-design';

app.use(FConfigProvider);
```

2. 配置

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

### API 方式

```js
import { FConfigProvider } from 'fes-design';

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
