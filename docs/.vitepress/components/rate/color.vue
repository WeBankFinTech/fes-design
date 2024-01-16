<template>
    <FRate v-model:value="value" color="#ff4d4f"></FRate>
    <FRate v-model:value="value" color="orange"></FRate>
    <FRate v-model:value="value" color="yellow"></FRate>
    <FRate v-model:value="value" color="#00cb91"></FRate>
    <FRate v-model:value="value" color="#5384ff"></FRate>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(4);
</script>
