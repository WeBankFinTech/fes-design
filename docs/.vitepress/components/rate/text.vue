<template>
    <FSpace>
        <FRate v-model:value="value" :texts="texts" show-text></FRate>
    </FSpace>

    <FSpace>
        <FRate v-model:value="value2" :texts="texts2" show-text></FRate>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
const value2 = ref(3);

const texts = ['oops', 'disappointed', 'normal', 'good', 'great'];
const texts2 = ['oops', 'disappointed', 'normal'];
</script>
