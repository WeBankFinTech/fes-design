<template>
    <FSpace>
        <FCheckboxGroup v-model="arr" @change="handleChange">
            <FCheckbox v-for="i in len" :key="i" :value="i">
                {{ i }}
            </FCheckbox>
        </FCheckboxGroup>
    </FSpace>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const len = 30;
        const arr = ref([]);
        const handleChange = (value) => {
            console.log('change:', value);
        };
        return {
            len,
            arr,
            handleChange,
        };
    },
};
</script>
