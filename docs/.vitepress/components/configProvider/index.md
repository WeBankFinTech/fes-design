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

### 暗色模式

设置 `theme="dark"` 开启暗色主题。组件的全部设计令牌（背景/文字/边框/阴影/遮罩等 60+ CSS 变量）会整组翻转，无需逐个覆盖：

--DARKTHEME

--CODE

跟随系统偏好自动切换：

```vue
<template>
    <f-config-provider :theme="isDark ? 'dark' : 'light'">
        <app />
    </f-config-provider>
</template>

<script setup>
import { usePreferredDark } from '@vueuse/core';

const isDark = usePreferredDark();
</script>
```

#### SSR 首屏防闪白

服务端渲染时，组件挂载前页面以默认亮色渲染，暗色主题会出现闪白。在入口 HTML 的 `head` 中插入主题样式标签可消除：

```js
import { getThemeStyleTag } from '@fesjs/fes-design';

// 模板中：${getThemeStyleTag('dark')}
// 输出 <style>:root { --f-component-bg-color: #1f1f1f; ... }</style>
```

#### 深度定制

暗色预设之上可通过 `themeOverrides` 继续覆盖任意变量（优先级高于预设）：

```vue
<f-config-provider
    theme="dark"
    :themeOverrides="{ common: { bodyBgColor: '#0d0d0d' } }"
>
    <app />
</f-config-provider>
```

## Props

| 属性           | 说明                                                                                                             | 类型              | 默认值                |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------- |
| getContainer   | 指定弹窗挂载的 DOM 节点                                                                                          | () => HTMLElement | `() => document.body` |
| locale         | 语言包配置，已支持语言包可到[这里](https://github.com/WeBankFinTech/fes-design/tree/main/components/locales)查看 | object            | 中文                  |
| theme          | 主题模式，可选 `dark` / `light`                                                                                  | string            | -                     |
| themeOverrides | 主题覆盖的 css 选项（优先级高于 theme 预设）                                                                      | object            | -                     |
