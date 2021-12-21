# 调整主题

`fes-design` 使用 `FConfigProvider` 调整主题。

## 暗色主题

支持路上～

## 修改主题变量

```vue
<script setup>
import { FConfigProvider } from '@fesjs/fes-design';

const themeOverrides = {
    common: {
        primaryColor: '#5384ff',

        successColor: '#00cb91',
        dangerColor: '#ff4d4f',
        warningColor: '#f29360',
        tipColor: '#5384ff',

        white: '#fff',
        black: '#000',

        bodyBgColor: '#fff',

        fontColorBase: '#0f1222',
        fontSizeBase: '14px',

        borderRadiusBase: '4px',
        borderRadiusSm: '2px',
        borderWidthBase: '1px',
        borderStyleBase: 'solid',

        borderColorBase: '#cfd0d3',

        shadowColor: 'rgba(18, 18, 18, 0.1)',
        shadowColorSm: 'rgba(18, 18, 18, 0.2)',
        shadowRadius: '12px',
        shadowRadiusSm: '4px',

        maskColor: 'rgba(18, 18, 18, 0.45)',
    }
}
</script>

<template>
    <FConfigProvider :themeOverrides="themeOverrides">
        <my-app />
    </FConfigProvider>
</template>
```
