<template>
    <f-table :height="250" :data="data">
        <f-table-column prop="date" label="日期"></f-table-column>
        <f-table-column prop="name" label="姓名"></f-table-column>
        <f-table-column prop="address" label="地址"></f-table-column>
    </f-table>
</template>
<script>
import { reactive } from 'vue';

const createData = (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push({
            date: `2016-05-${i < 10 ? '0' + i : i}`,
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
        });
    }
    return arr;
};

export default {
    setup() {
        const data = reactive(createData(10));
        return {
            data,
        };
    },
};
</script>
