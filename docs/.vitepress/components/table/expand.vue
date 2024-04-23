<template>
    <div style="margin-bottom: 10px">展开的行keys： {{ expandedKeys }}</div>
    <FTable
        ref="tableRef"
        v-model:expandedKeys="expandedKeys"
        :data="data"
        rowKey="id"
        @expandChange="expandChange"
    >
        <FTableColumn v-slot="{ row }" type="expand">
            <FGrid
                :gutter="[20, 20]"
                wrap
                style="background: #f8f8f8; padding: 16px"
            >
                <FGridItem :span="12"> 省份：{{ row.province }} </FGridItem>
                <FGridItem :span="12"> 市区：{{ row.city }} </FGridItem>
                <FGridItem :span="12"> 邮编：{{ row.zip }} </FGridItem>
                <FGridItem :span="12"> 地址：{{ row.address }} </FGridItem>
            </FGrid>
        </FTableColumn>
        <FTableColumn prop="date" label="日期"></FTableColumn>
        <FTableColumn prop="name" label="姓名"></FTableColumn>
    </FTable>
    <FButton style="margin-top: 10px" @click="toggle">
        手动展开/关闭第一行
    </FButton>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const expandedKeys = ref([1]);
        const tableRef = ref(null);
        const data = Array.from([1, 2, 3], (i) => {
            return {
                id: i,
                date: `2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-${
                    i < 10 ? `0${i}` : i
                }`,
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333,
            };
        });
        const expandChange = ({ row, expanded }) => {
            console.log(
                '[table.expand] [expandChange] row:',
                row,
                ' expanded:',
                expanded,
            );
        };
        const toggle = () => {
            tableRef.value.toggleRowExpend({ row: data[0] });
        };
        return {
            tableRef,
            data,
            toggle,
            expandChange,
            expandedKeys,
        };
    },
};
</script>
