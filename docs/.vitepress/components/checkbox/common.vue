<template>
    <FSpace>
        <FCheckbox v-model="checked" @change="handleChange">复选框</FCheckbox>
        <FCheckbox disabled>复选框-禁用状态</FCheckbox>
        <FCheckbox indeterminate>复选框-不确定状态</FCheckbox>
    </FSpace>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const checked = ref();
        const handleChange = (val) => {
            console.log(val);
        };
        return {
            checked,
            handleChange,
        };
    },
};
</script>
