export const SCRIPT_TEMPLATE = `
<script setup>
IMPORT_EXPRESSION
</script>
`;

export const DEMO_ENTRY_FILE = `
<template>
    <Demo />
</template>

<script setup>
import {setupFesDesign } from './fes-design.js';
import Demo from './demo.vue';
setupFesDesign();
</script>
`;
