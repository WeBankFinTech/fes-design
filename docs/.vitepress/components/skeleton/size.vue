<template>
    <FRadioGroup v-model="size">
        <FRadio value="small">small</FRadio>
        <FRadio value="middle">middle</FRadio>
        <FRadio value="large">large</FRadio>
    </FRadioGroup>

    <FDivider></FDivider>

    <FSpace vertical>
        <FSkeleton :size="size"></FSkeleton>
        <FSkeleton :width="200" :size="size" :sharp="false"></FSkeleton>
        <FSkeleton round :size="size"></FSkeleton>
        <FSkeleton circle :size="size"></FSkeleton>
    </FSpace>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const size = ref('middle');
</script>
