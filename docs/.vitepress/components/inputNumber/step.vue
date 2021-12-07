<template>
    <Space>
        <FInputNumber
            :step="step"
            :max="12"
            :precision="precision"
        ></FInputNumber>
    </Space>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';

export default {
    setup() {
        const precision = 2;
        const step = 5;
        return {
            precision,
            step
        };
    }
};
</script>
