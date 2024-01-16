<template>
    <FRate v-model:value="value"></FRate>
    <FRate v-model:value="value" line-style></FRate>
    <span>value值：{{ value }}</span>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
