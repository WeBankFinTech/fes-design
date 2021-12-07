<template>
    <Space>
        <FInput
            ref="inputRef"
            v-model="inputValue"
            @keydown="handleKeydown"
            @input="handleInput"
            @change="handleChange"
            placeholder="请输入"
        />
    </Space>
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
            handleInput
        };
    }
};
</script>
