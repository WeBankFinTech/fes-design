<template>
    <FSpace vertical>
        <FInput
            ref="inputRef"
            v-model="inputValue"
            placeholder="请输入"
            @keydown="handleKeydown"
            @input="handleInput"
            @change="handleChange"
        />
        <FInput placeholder="请输入" :maxlength="100" showWordLimit />
    </FSpace>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    setup() {
        const inputValue = ref('hello input');
        watch(inputValue, () => {
            console.log(
                '[input.common] [watch] inputValue.value:',
                inputValue.value,
            );
        });

        const handleKeydown = (value) => {
            console.log('[input.common] [handleKeydown] value:', value);
        };
        const handleChange = () => {
            console.log(
                '[input.common] [handleChange] inputValue.value:',
                inputValue.value,
            );
        };
        const handleInput = (value) => {
            console.log(
                '[input.common] [handleInput] value:',
                value,
                ' inputValue.value:',
                inputValue.value,
            );
        };

        return {
            inputValue,
            handleKeydown,
            handleChange,
            handleInput,
        };
    },
};
</script>
