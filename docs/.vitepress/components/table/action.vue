<template>
    <f-table :data="data">
        <f-table-column prop="date" label="日期"></f-table-column>
        <f-table-column prop="name" label="姓名"></f-table-column>
        <f-table-column prop="address" label="地址"></f-table-column>
        <f-table-column
            label="操作"
            align="center"
            :width="200"
            :action="action"
        ></f-table-column>
    </f-table>
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
        const action = [
            {
                label: '编辑',
                func: (row) => {
                    console.log('[table.action] [action.编辑] row:', row);
                },
            },
            {
                label: '删除',
                func: (row) => {
                    console.log('[table.action] [action.删除] row:', row);
                },
            },
        ];
        return {
            data,
            action,
        };
    },
};
</script>
