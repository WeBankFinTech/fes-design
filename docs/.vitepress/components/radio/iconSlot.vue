<template>
    <FRadioGroup v-model="value">
        <FRadioButton :value="1">
            <template #icon>
                <ProductOutlined />
            </template>
            选项一
        </FRadioButton>
        <FRadioButton :value="2">
            <template #icon>
                <StarOutlined />
            </template>
            选项二
        </FRadioButton>
        <FRadioButton :value="3">选项三</FRadioButton>
    </FRadioGroup>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(1);
</script>
