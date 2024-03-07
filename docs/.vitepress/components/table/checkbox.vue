<template>
    <FSpace>
        是否多选:
        <FRadioGroup
            v-model="multiple"
            :options="[
                { label: '是（默认）', value: true },
                { label: '否', value: false },
            ]"
        />
    </FSpace>
    <div style="margin-bottom: 10px">选中的keys: {{ checkedKeys }}</div>
    <FTable
        ref="multipleTable"
        v-model:checkedKeys="checkedKeys"
        :data="data"
        rowKey="id"
        @selectionChange="selectionChange"
    >
        <FTableColumn
            type="selection"
            :selectable="selectable"
            :multiple="multiple"
        ></FTableColumn>
        <FTableColumn prop="date" label="日期"></FTableColumn>
        <FTableColumn prop="name" label="姓名"></FTableColumn>
        <FTableColumn prop="address" label="地址"></FTableColumn>
    </FTable>
    <div style="margin-top: 10px">
        <FButton @click="toggleSelection(data[0])">切换第一行</FButton>
        <FButton @click="toggleSelection(null)">取消选择</FButton>
    </div>
</template>
<script>
import { reactive, ref } from 'vue';
export default {
    setup() {
        const checkedKeys = ref([1]);

        const multiple = ref(true);
        const data = reactive(
            Array.from([1, 2, 3], (i) => {
                return {
                    id: i,
                    date: `2016-05-${i < 10 ? '0' + i : i}`,
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        const selectable = ({ rowIndex }) => {
            return rowIndex !== 1;
        };
        const selectionChange = (selection) => {
            console.log(
                '[table.checkbox] [selectionChange] selection:',
                selection,
            );
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
            checkedKeys,
            data,
            selectable,
            multiple,
            multipleTable,
            toggleSelection,
            selectionChange,
        };
    },
};
</script>
