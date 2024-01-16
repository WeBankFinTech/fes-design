<template>
    <FRate v-model:value="value">
        <template #content="slotProps">
            <StarOutlined :size="slotProps.size" :color="slotProps.color" />
        </template>
    </FRate>

    <FRate v-model:value="value" color="#5384ff" size="large">
        <template #content="slotProps">
            <StarOutlined :size="slotProps.size" :color="slotProps.color" />
        </template>
    </FRate>

    <FRate v-model:value="value" color="#5384ff">
        <template #content="slotProps">
            <QuestionCircleOutlined
                :size="slotProps.size"
                :color="slotProps.color"
            />
        </template>
    </FRate>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
