<template>
    <space>
        <FCheckboxGroup v-model="arr" @change="handleChange">
            <FCheckbox :value="1">111</FCheckbox>
            <FCheckbox :value="2">222</FCheckbox>
            <FCheckbox :value="3">333</FCheckbox>
        </FCheckboxGroup>
        <FCheckboxGroup disabled>
            <FCheckbox :value="1">111</FCheckbox>
            <FCheckbox :value="2">222</FCheckbox>
            <FCheckbox :value="3">333</FCheckbox>
        </FCheckboxGroup>
    </space>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const arr = ref([])
        const handleChange = (value) => {
            console.log("change:", value);
        };
        return {
            arr,
            handleChange,
        };
    },
};
</script>
