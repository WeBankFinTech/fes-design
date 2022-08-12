<template>
    <FSelect
        filterable
        valueField="key"
        labelField="name"
        style="width: 200px"
        :options="optionList"
    >
    </FSelect>
</template>
<script>
import { reactive } from 'vue';

const TOTAL_COUNT = 10000;

const DataItems = [];
let count = TOTAL_COUNT;
while (count--) {
    const index = TOTAL_COUNT - count;
    DataItems.push({
        name: index,
        key: index,
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
