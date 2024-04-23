<template>
    <FRadioGroup v-model="size">
        <FRadio value="small">small</FRadio>
        <FRadio value="middle">middle</FRadio>
        <FRadio value="large">large</FRadio>
    </FRadioGroup>

    <FDivider />

    <FSpace vertical>
        <FSkeleton :size="size" />
        <FSkeleton :width="200" :size="size" :sharp="false" />
        <FSkeleton round :size="size" />
        <FSkeleton circle :size="size" />
    </FSpace>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const size = ref('middle');
</script>
