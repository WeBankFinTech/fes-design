<template>
    <FSpace>
        <FRate v-model="value" :texts="texts" show-text />
    </FSpace>

    <FSpace>
        <FRate v-model="value2" :texts="texts2" show-text />
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
const value2 = ref(3);

const texts = ['oops', 'disappointed', 'normal', 'good', 'great'];
const texts2 = ['oops', 'disappointed', 'normal'];
</script>
