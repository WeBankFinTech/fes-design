<template>
    <FRate v-model:value="value" readonly></FRate>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
