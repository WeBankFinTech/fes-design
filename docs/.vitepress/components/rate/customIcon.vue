<template>
    <FSpace>
        <FRate v-model="value" allow-half>
            <template #content="slotProps">
                <CheckCircleOutlined :size="slotProps.size" />
            </template>
        </FRate>
    </FSpace>

    <FSpace>
        <FRate v-model="value" color="#5384ff" allow-half>
            <template #content="slotProps">
                <QuestionCircleOutlined :size="slotProps.size" />
            </template>
        </FRate>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
