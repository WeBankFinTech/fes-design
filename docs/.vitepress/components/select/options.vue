<template>
    <FSelect :options="optionList"> </FSelect>
</template>
<script>
import { reactive } from 'vue';

const TOTAL_COUNT = 1000;

const DataItems = [];
let count = TOTAL_COUNT;
while (count--) {
    const index = TOTAL_COUNT - count;
    DataItems.push({
        label: index,
        value: index,
    });
}

export default {
    setup() {
        const optionList = reactive(DataItems);
        return {
            optionList,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
</style>
