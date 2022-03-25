<template>
    <FSelect
        filterable
        valueField="key"
        labelField="name"
        :options="optionList"
    >
        <template #addon>
            <div class="addon">如果你点开了这个例子，可能你需要它</div>
        </template>
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
<style scoped>
.fes-select {
    width: 200px;
}
.action {
    border-top: 1px;
}
</style>
