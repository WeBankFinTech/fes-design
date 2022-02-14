<template>
    <Space>
        <FInputNumber v-model="val" :max="100" :precision="0"></FInputNumber>
        {{ val }}
    </Space>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const val = ref(10);
        return {
            val,
        };
    },
};
</script>
