<template>
    <FSpace>
        <FRadioGroup
            v-model="val"
            :cancelable="false"
            :options="options"
            @change="handleChange"
        >
        </FRadioGroup>
    </FSpace>
    <FSpace>
        <FRadioGroup
            v-model="val1"
            :cancelable="false"
            :options="options"
            optionType="button"
            @change="handleChange"
        >
        </FRadioGroup>
    </FSpace>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const val = ref();
        const val1 = ref();
        const options = ref([]);
        const len = 10;
        for (let index = 1; index <= len; index++) {
            options.value.push({ label: index, value: index });
        }
        const handleChange = (value) => {
            console.log('[radio.options] [handleChange] value:', value);
        };
        return {
            val,
            val1,
            options,
            handleChange,
        };
    },
};
</script>
