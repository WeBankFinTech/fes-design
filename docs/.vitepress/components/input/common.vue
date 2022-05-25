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
            console.log(inputValue.value);
        });

        const handleKeydown = (value) => {
            console.log(value);
        };
        const handleChange = () => {
            console.log('change', inputValue.value);
        };
        const handleInput = (value) => {
            console.log('input', value, inputValue.value);
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
