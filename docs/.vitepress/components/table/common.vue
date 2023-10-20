<template>
    <FTable :data="data" layout="auto">
        <FTableColumn prop="date" label="日期">
            <template #default="{ row }">
                {{ row.date }}
            </template>
        </FTableColumn>
        <FTableColumn prop="name" label="姓名"></FTableColumn>
        <FTableColumn prop="address" label="地址"></FTableColumn>
    </FTable>
</template>
<script>
import { reactive } from 'vue';
export default {
    setup() {
        const data = reactive(
            Array.from([1, 2, 3], (i) => {
                return {
                    date: `2016-05-${i < 10 ? '0' + i : i}`,
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        return {
            data,
        };
    },
};
</script>
