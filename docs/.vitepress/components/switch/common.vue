<template>
    <FSwitch v-model="val" @change="handleChange"></FSwitch>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const val = ref();
        const handleChange = (value) => {
            console.log('[switch.common] [handleChange] value:', value);
        };
        return {
            val,
            handleChange,
        };
    },
};
</script>
