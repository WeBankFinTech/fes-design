<template>
    <FSpace>
        <FRate v-model:value="value" :count="count"></FRate>
    </FSpace>
    <FSpace>
        <FInputNumber v-model="count" :min="3" :max="10"></FInputNumber>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
const count = ref(5);
</script>
