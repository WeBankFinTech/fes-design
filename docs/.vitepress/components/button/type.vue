<template>
    <Space>
        <FButton>Default</FButton>
        <FButton type="primary">Primary</FButton>
        <FButton type="text">Text</FButton>
        <FButton type="link">Link</FButton>
    </Space>
</template>

<script setup>
import { setupFesDesign } from './fes-design.js';
setupFesDesign();
const msg = ref('Hello World!')
</script>
