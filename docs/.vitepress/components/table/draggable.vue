<template>
    <f-table
        :data="data"
        draggable
        layout="auto"
        @dragstart="onDragstart"
        @dragend="onDragend"
    >
        <f-table-column prop="date" label="日期">
            <template #default="{ row }">
                {{ row.date }}
            </template>
        </f-table-column>
        <f-table-column prop="name" label="姓名"></f-table-column>
        <f-table-column prop="address" label="地址"></f-table-column>
    </f-table>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const data = ref(
            Array.from([1, 2, 3], (i) => {
                return {
                    date: `2016-05-${i < 10 ? '0' + i : i}`,
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        const onDragstart = (...arg) => {
            console.log('onDragstart:', arg);
        };
        const onDragend = (...arg) => {
            console.log('onDragend:', arg);
        };
        return {
            data,
            onDragstart,
            onDragend,
        };
    },
};
</script>
