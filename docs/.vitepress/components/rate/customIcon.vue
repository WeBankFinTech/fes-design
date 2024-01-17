<template>
    <FSpace>
        <FRate v-model="value">
            <template #content="slotProps">
                <CheckCircleOutlined
                    :size="slotProps.size"
                    :color="slotProps.color"
                />
            </template>
        </FRate>
    </FSpace>

    <FSpace>
        <FRate v-model="value" color="#5384ff" size="large">
            <template #content="slotProps">
                <StarOutlined :size="slotProps.size" :color="slotProps.color" />
            </template>
        </FRate>
    </FSpace>

    <FSpace>
        <FRate v-model="value" color="#5384ff">
            <template #content="slotProps">
                <QuestionCircleOutlined
                    :size="slotProps.size"
                    :color="slotProps.color"
                />
            </template>
        </FRate>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
</script>
