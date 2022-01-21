<template>
    <FRadioGroup v-model="inline">
        <FRadio :value="false">flex</FRadio>
        <FRadio :value="true">inline-flex</FRadio>
    </FRadioGroup>

    <FDivider></FDivider>

    <FSpace class="box-wrapper" :inline="inline">
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
.box-wrapper {
    border: 1px dashed #ccc;
}
</style>
