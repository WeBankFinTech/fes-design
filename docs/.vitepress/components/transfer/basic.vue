<template>
    <FTransfer :options="options" :style="{ width: '520px' }" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const options = ref(
    new Array(10)
        .fill(null)
        .map((_, index) => ({ label: `Option ${index + 1}`, value: index })),
);
</script>
