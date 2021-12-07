<template>
    <Space>
        <FInputNumber :precision="0" :placeholder="placeholder"></FInputNumber>
    </Space>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const placeholder = ref();
        return {
            placeholder
        };
    }
};
</script>
