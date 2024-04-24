<template>
    <FSpace>
        <FRate v-model="value" size="small" />
    </FSpace>
    <FSpace>
        <FRate v-model="value" />
    </FSpace>
    <FSpace>
        <FRate v-model="value" size="large" />
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
