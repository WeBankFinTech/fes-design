<template>
    <FButton class="mb-10" type="primary" @click="handleFocus">
        手动聚焦
    </FButton>
    <FInput ref="inputRef" placeholder="请输入"></FInput>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';

export default {
    setup() {
        const inputRef = ref(null);

        // 自动聚焦和失焦
        onMounted(() => {
            setTimeout(() => {
                inputRef.value?.focus();
            }, 1000);

            setTimeout(() => {
                inputRef.value?.blur();
            }, 5000);
        });

        // 手动聚焦
        const handleFocus = async () => {
            await nextTick();
            inputRef.value?.focus();
        };

        return {
            inputRef,
            handleFocus,
        };
    },
};
</script>

<style scoped>
.mb-10 {
    margin-bottom: 10px;
}
</style>
