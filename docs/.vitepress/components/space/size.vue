<template>
    <FRadioGroup v-model="size">
        <FRadio value="xsmall">xsmall</FRadio>
        <FRadio value="small">small</FRadio>
        <FRadio value="middle">middle</FRadio>
        <FRadio value="large">large</FRadio>
    </FRadioGroup>

    <FDivider />

    <FSpace :size="size">
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
    </FSpace>

    <FDivider />

    <FSpace vertical :size="size">
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
    </FSpace>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const size = ref('small');
</script>
