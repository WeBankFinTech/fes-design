<p align="center">
  <a href="">
    <img width="362" src="./docs/public/images/fes-logo.png">
  </a>
</p>

<h1 align="center">Fes Design</h1>

<div align="center">

一个 vue3 组件库。
</div>

## Install

```bash
npm i @fesjs/fes-design
```

```bash
pnpm i @fesjs/fes-design
```

## Usage

```js
<template>
    <FButton type="primary">Primary</FButton>
    <CloseCircleFilled />
</template>

<script setup>
import {FButton} from '@fesjs/fes-design';
import {CloseCircleFilled} from '@fesjs/fes-design/icon';
</script>
```

### 按需加载（临时方案）

配置 `babel-plugin-import`。

```js
{
    plugins: [
        [
            "import",
            {
                "libraryName": "@fesjs/fes-design",
                camel2DashComponentName: false,
                "customName": (name) => {
                    name = name.slice(1).replace(/([A-Z])/g, "-$1").toLowerCase().slice(1)
                    return `@fesjs/fes-design/es/${name}`;
                },
                "style": (name) => {
                    return `${name}/style`;
                }
            },
            'fes-design'
        ]
    ]
}
```
