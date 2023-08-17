<template>
    <FSpace>
        <FRadioGroup v-model="val" :cancelable="false" @change="handleChange">
            <FRadio v-for="i in len" :key="i" :value="i">{{ i }}</FRadio>
        </FRadioGroup>
    </FSpace>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const val = ref();
        const len = 30;
        const handleChange = (value) => {
            console.log('[radio.group] [handleChange] value:', value);
        };
        return {
            len,
            val,
            handleChange,
        };
    },
};
</script>
