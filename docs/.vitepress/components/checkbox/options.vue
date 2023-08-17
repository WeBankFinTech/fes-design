<template>
    <FSpace>
        <FCheckboxGroup
            v-model="arr"
            :options="options"
            @change="handleChange"
        ></FCheckboxGroup>
    </FSpace>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const len = 10;
        const options = ref([]);
        const arr = ref([]);

        for (let index = 1; index <= len; index++) {
            options.value.push({
                label: index,
                value: index,
            });
        }

        const handleChange = (value) => {
            console.log('[checkbox.options] [handleChange] value:', value);
        };
        return {
            arr,
            options,
            handleChange,
        };
    },
};
</script>
