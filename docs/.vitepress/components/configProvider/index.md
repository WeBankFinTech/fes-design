# Config Provider 全局配置

为组件提供统一的全局化配置。
Config Provider 使用了 [Vue 的 provide/inject 特性](https://v3.vuejs.org/guide/composition-api-provide-inject.html#using-provide)。

## 组件注册

```js
import { FConfigProvider } from '@fesjs/fes-design';

app.use(FConfigProvider);
```

## 组件使用

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

### 切换语言

--CHANGELOCALE

### 自定义语言

--CUSTOMLOCALE

--CODE

## Props

| 属性           | 说明                                                                                                             | 类型              | 默认值                |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------- |
| getContainer   | 指定弹窗挂载的 DOM 节点                                                                                          | () => HTMLElement | `() => document.body` |
| locale         | 语言包配置，已支持语言包可到[这里](https://github.com/WeBankFinTech/fes-design/tree/main/components/locales)查看 | object            | 中文                  |
| themeOverrides | 主题覆盖的 css 选项                                                                                              | object            | -                     |
