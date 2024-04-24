<template>
    <FSpace>
        <FInput placeholder="请输入颜色或者色号" @change="change" />
    </FSpace>
    <FSpace>
        <FRate v-model="value" :color="color" allow-half />
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const color = ref();

const value = ref(4);

const change = (val) => {
    color.value = val;
};
</script>
