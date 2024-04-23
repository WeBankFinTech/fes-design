<template>
    <f-space vertical>
        <f-space>
            <FButton @click="toggleSort">Sort By ID(ascend)</FButton>
            <FButton @click="clearSorter">Clear Sorter</FButton>
        </f-space>
        <FTable ref="table" :data="data" layout="auto">
            <FTableColumn sortable prop="id" label="ID"> </FTableColumn>
            <FTableColumn sortable prop="date" label="日期">
                <template #default="{ row }">
                    {{ row.date }}
                </template>
            </FTableColumn>
            <FTableColumn prop="name" label="姓名"></FTableColumn>
            <FTableColumn prop="address" label="地址"></FTableColumn>
        </FTable>
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
                    date: `2016-05-${i < 10 ? `0${i}` : i}`,
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
