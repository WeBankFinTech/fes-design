<template>
    <FRate
        v-model="value"
        allow-half
        clearable
        @change="changeValue"
        @clear="clear"
    ></FRate>
    <span>value值：{{ value }}</span>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(2.5);

const changeValue = (val) => {
    console.log('rate组件value变更:', val);
};

const clear = () => {
    console.log('rate组件value清除');
};
</script>
