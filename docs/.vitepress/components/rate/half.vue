<template>
    <FRate v-model:value="value" half></FRate>
    <FRate v-model:value="value" half line-style clearable></FRate>
    <FRate v-model:value="value" color="#5384ff" half>
        <template #content="slotProps">
            <QuestionCircleOutlined
                :size="slotProps.size"
                :color="slotProps.color"
            />
        </template>
    </FRate>
    <span>value值：{{ value }}</span>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(2.5);
</script>
