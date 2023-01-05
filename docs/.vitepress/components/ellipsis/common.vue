<template>
    <FEllipsis
        :content="text"
        :tooltip="{ popperClass: 'a', showAfter: 500 }"
        style="max-width: 240px"
    >
    </FEllipsis>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const text = ref(
            '住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪',
        );

        return {
            text,
        };
    },
};
</script>
