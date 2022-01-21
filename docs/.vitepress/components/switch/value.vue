<template>
    <FSwitch v-model="value" :activeValue="{ a: 1 }" :inactiveValue="{ b: 1 }">
    </FSwitch>
    <div>选中的值： {{ value }}</div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const value = ref();
        return {
            value,
        };
    },
});
</script>
