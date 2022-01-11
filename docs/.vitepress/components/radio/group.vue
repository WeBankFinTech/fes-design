
<template>
    <space>
        <FRadioGroup v-model="val" @change="handleChange">
            <FRadio :value="1">1</FRadio>
            <FRadio :value="2">2</FRadio>
            <FRadio :value="3">3</FRadio>
            <FRadio :value="4">4</FRadio>
        </FRadioGroup>
        <FRadioGroup disabled>
            <FRadio :value="1">1</FRadio>
            <FRadio :value="2">2</FRadio>
            <FRadio :value="3">3</FRadio>
            <FRadio :value="4">4</FRadio>
        </FRadioGroup>
    </space>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const val = ref()
        const handleChange = (value) => {
            console.log("change:", value);
        };
        return {
            val,
            handleChange,
        };
    },
};
</script>