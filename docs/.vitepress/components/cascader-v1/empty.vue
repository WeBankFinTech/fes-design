<template>
    <div>
        <FCascaderV1 v-model="value" :options="options"> </FCascaderV1>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
    setup() {
        const state = reactive({
            value: '',
        });

        return {
            ...toRefs(state),
            options: [],
        };
    },
});
</script>

<style scoped>
.fes-cascader-v1 {
    width: 200px;
}
</style>
