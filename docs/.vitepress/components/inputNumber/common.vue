<template>
    <FSpace>
        <FInputNumber v-model="val" :max="100"></FInputNumber>
        {{ val }}
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const val = ref(10);
        return {
            val,
        };
    },
};
</script>
