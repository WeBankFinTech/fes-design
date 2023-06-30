<template>
    <f-table
        :data="data"
        bordered
        verticalLine
        layout="auto"
        :columns="columns"
    >
    </f-table>
</template>
<script>
import { h, defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const data = Array.from([1, 2, 3], () => {
            return {
                date: `2016-05`,
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333,
            };
        });
        const columns = [
            {
                type: 'selection',
            },
            {
                prop: 'date',
                label: '日期',
                width: 150,
                render: ({ row }) => {
                    return h('span', row.date);
                },
                renderHeader: () => {
                    return h('span', { style: { fontSize: '20px' } }, '日期');
                },
            },
            {
                label: '配送信息',
                children: [
                    { prop: 'name', label: '姓名', width: 150 },
                    {
                        label: '地址信息',
                        children: [
                            { prop: 'province', label: '省份', width: 150 },
                            { prop: 'city', label: '市区', width: 150 },
                            { prop: 'address', label: '详细地址', width: 300 },
                        ],
                    },
                ],
            },
        ];
        return {
            data,
            columns,
        };
    },
});
</script>
