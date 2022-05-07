<template>
    <space>
        <FRadioGroup v-model="val" @change="handleChange">
            <FRadio v-for="i in len" :key="i" :value="i">{{ i }}</FRadio>
        </FRadioGroup>
    </space>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const val = ref();
        const len = 30;
        const handleChange = (value) => {
            console.log('change:', value);
        };
        return {
            len,
            val,
            handleChange,
        };
    },
};
</script>
