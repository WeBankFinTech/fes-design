<template>
    <FSwitch v-model="val" @change="handleChange" />
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
    setup() {
        const val = ref();
        const handleChange = (value) => {
            console.log('[switch.common] [handleChange] value:', value);
        };
        onMounted(() => {
            val.value = true;
        });
        return {
            val,
            handleChange,
        };
    },
};
</script>
