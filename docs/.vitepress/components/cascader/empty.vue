<template>
    <div>
        <FCascader v-model="value" :options="options"> </FCascader>
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
.fes-cascader {
    width: 200px;
}
</style>
