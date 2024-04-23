<template>
    <FTable
        :data="data"
        :columns="columns"
        layout="auto"
        @headerResize="handleHeaderResize"
    />
</template>
<script setup lang="ts">
import { reactive } from 'vue';

const data = reactive(
    Array.from([1, 2, 3], (i) => {
        return {
            date: `2016-05-${i < 10 ? `0${i}` : i}`,
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
        };
    }),
);

const columns = [
    {
        prop: 'date',
        label: '日期',
        minWidth: 200,
        resizable: true,
    },
    {
        prop: 'name',
        label: '姓名',
        minWidth: 200,
        resizable: true,
    },
    {
        prop: 'address',
        label: '地址',
        minWidth: 300,
    },
];

const handleHeaderResize = (...args: any[]) => {
    console.log('[FTable.headerResize]:', args);
};
</script>
