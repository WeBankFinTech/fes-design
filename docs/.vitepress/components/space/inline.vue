<template>
    <FRadioGroup v-model="inline">
        <FRadio :value="false">flex</FRadio>
        <FRadio :value="true">inline-flex</FRadio>
    </FRadioGroup>

    <FDivider />

    <FSpace class="space-wrapper" :inline="inline">
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
    </FSpace>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const inline = ref(false);
</script>

<style scoped>
.space-wrapper {
    border: 1px dashed #ccc;
}
</style>
