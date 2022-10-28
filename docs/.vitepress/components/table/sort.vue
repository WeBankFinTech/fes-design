<template>
    <f-space vertical>
        <f-space>
            <f-button @click="toggleSort">Sort By ID(ascend)</f-button>
            <f-button @click="clearSorter">Clear Sorter</f-button>
        </f-space>
        <f-table ref="table" :data="data" layout="auto">
            <f-table-column sortable prop="id" label="ID"> </f-table-column>
            <f-table-column sortable prop="date" label="日期">
                <template #default="{ row }">
                    {{ row.date }}
                </template>
            </f-table-column>
            <f-table-column prop="name" label="姓名"></f-table-column>
            <f-table-column prop="address" label="地址"></f-table-column>
        </f-table>
    </f-space>
</template>
<script>
import { reactive, ref } from 'vue';
export default {
    setup() {
        const table = ref();
        const data = reactive(
            Array.from([1, 2, 3], (i) => {
                return {
                    id: 4 - i,
                    date: `2016-05-${i < 10 ? '0' + i : i}`,
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        const toggleSort = () => {
            table.value.sort('id', 'ascend');
        };
        const clearSorter = () => {
            table.value.clearSorter();
        };
        return {
            table,
            data,
            toggleSort,
            clearSorter,
        };
    },
};
</script>
