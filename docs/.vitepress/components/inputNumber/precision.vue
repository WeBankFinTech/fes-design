<template>
    <FSpace align="center">
        <FInputNumber v-model="num" :precision="precision" />
        当前值: {{ num }}
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const num = ref();

const precision = 2;
</script>
