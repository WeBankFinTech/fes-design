exports.SCRIPT_TEMPLATE = `
<script setup>
IMPORT_EXPRESSION
</script>
`;

exports.DEMO_ENTRY_FILE = `
<template>
    <Demo />
</template>

<script setup>
import {setupFesDesign } from './fes-design.js';
import Demo from './demo.vue';
setupFesDesign();
</script>
`;
