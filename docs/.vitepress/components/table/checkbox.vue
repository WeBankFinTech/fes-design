<template>
    <f-table ref="multipleTable" :data="data" rowKey="date">
        <f-table-column
            type="selection"
            :selectable="selectable"
        ></f-table-column>
        <f-table-column prop="date" label="日期"></f-table-column>
        <f-table-column prop="name" label="姓名"></f-table-column>
        <f-table-column prop="address" label="地址"></f-table-column>
    </f-table>
    <div class="buttons">
        <f-button @click="toggleSelection(data[0])">切换第一行</f-button>
        <f-button @click="toggleSelection">取消选择</f-button>
    </div>
</template>
<script>
import { reactive, ref } from 'vue';
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
        const selectable = ({ row, rowIndex }) => {
            return rowIndex !== 1;
        };
        const multipleTable = ref(null);
        const toggleSelection = (row) => {
            if (row) {
                multipleTable.value.toggleRowSelection({ row });
            } else {
                multipleTable.value.clearSelection();
            }
        };
        return {
            data,
            selectable,
            multipleTable,
            toggleSelection,
        };
    },
};
</script>
