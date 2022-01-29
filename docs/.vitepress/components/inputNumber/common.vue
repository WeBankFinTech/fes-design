<template>
    <Space>
        <FInputNumber v-model="val" :precision="0"></FInputNumber>
    </Space>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const val = ref();
        return {
            val,
        };
    },
};
</script>
