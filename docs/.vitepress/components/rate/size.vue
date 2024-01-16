<template>
    <FRate v-model:value="value" size="small"></FRate>
    <FRate v-model:value="value"></FRate>
    <FRate v-model:value="value" size="large"></FRate>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
