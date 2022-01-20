<template>
    <f-table :data="data">
        <f-table-column v-slot="{ row }" prop="date" label="日期">
            <ClockCircleOutlined />{{ row.date }}
        </f-table-column>
        <f-table-column v-slot="{ row }" prop="name" label="姓名">
            <f-tag>{{ row.name }}</f-tag>
        </f-table-column>
        <f-table-column prop="address" label="地址"></f-table-column>
        <f-table-column label="操作">
            <f-button>编辑</f-button>
        </f-table-column>
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
        return {
            data,
        };
    },
};
</script>
