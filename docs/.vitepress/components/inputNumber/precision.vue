<template>
    <FSpace align="center">
        <FInputNumber v-model="num" :min="min" :max="max" :precision="precision" />
        当前值: {{ num }}
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const num = ref();

const min = 10;
const max = 100;
const precision = 2;
</script>
