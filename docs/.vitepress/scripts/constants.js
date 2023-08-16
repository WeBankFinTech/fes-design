exports.SCRIPT_TEMPLATE = `
<script>
IMPORT_EXPRESSION

export default {
    components: {
        COMPONENTS
    }
}
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
