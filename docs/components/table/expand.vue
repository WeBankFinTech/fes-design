<template>
    <f-table :data="data">
        <f-table-column type="expand" v-slot="{ row }">
            <f-grid :gutter="[20, 20]" wrap>
                <f-grid-item :span="12"> 省份：{{ row.province }} </f-grid-item>
                <f-grid-item :span="12"> 市区：{{ row.city }} </f-grid-item>
                <f-grid-item :span="12"> 邮编：{{ row.zip }} </f-grid-item>
                <f-grid-item :span="12"> 地址：{{ row.address }} </f-grid-item>
            </f-grid>
        </f-table-column>
        <f-table-column prop="date" label="日期"></f-table-column>
        <f-table-column prop="name" label="姓名"></f-table-column>
    </f-table>
</template>
<script>
export default {
    setup() {
        const data = Array.from([1, 2, 3], (i)=> {
            return {
                date: `2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-${i < 10 ? '0' + i : i}`,
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333,
            }
        })
        return {
            data
        }
    },
}
</script>