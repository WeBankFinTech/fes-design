<template>
    <FButton class="mb-10" type="primary" @click="handleFocus">
        手动聚焦
    </FButton>
    <FInput
        ref="inputRef"
        placeholder="请输入"
        @blur="handleInputBlur"
        @focus="handleInputFocus"
    ></FInput>
</template>

<script>
import { ref, nextTick } from 'vue';

export default {
    setup() {
        const inputRef = ref(null);

        // 手动聚焦
        const handleFocus = async () => {
            await nextTick();
            inputRef.value?.focus();

            setTimeout(() => {
                inputRef.value?.blur();
            }, 5000);
        };

        const handleInputBlur = (e) => {
            console.log('[input.handleFocus] [blur] e:', e);
        };
        const handleInputFocus = (e) => {
            console.log('[input.handleFocus] [focus] e:', e);
        };

        return {
            inputRef,
            handleFocus,
            handleInputBlur,
            handleInputFocus,
        };
    },
};
</script>

<style scoped>
.mb-10 {
    margin-bottom: 10px;
}
</style>
