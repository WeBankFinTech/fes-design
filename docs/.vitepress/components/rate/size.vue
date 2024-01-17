<template>
    <FSpace>
        <FRate v-model="value" size="small"></FRate>
    </FSpace>
    <FSpace>
        <FRate v-model="value"></FRate>
    </FSpace>
    <FSpace>
        <FRate v-model="value" size="large"></FRate>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
