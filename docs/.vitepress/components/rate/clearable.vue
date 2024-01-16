<template>
    <FRate v-model:value="value" clearable></FRate>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
