<template>
    <FTable :height="250" rowKey="date" virtualScroll :data="data">
        <FTableColumn prop="date" label="日期" :width="150" ellipsis fixed>
        </FTableColumn>
        <FTableColumn prop="name" label="姓名" :width="150"></FTableColumn>
        <FTableColumn prop="province" label="省份" :width="150"></FTableColumn>
        <FTableColumn prop="city" label="市区" :width="150"> </FTableColumn>
        <FTableColumn prop="address" label="地址" :width="800"></FTableColumn>
        <FTableColumn prop="zip" label="邮编" :width="120"> </FTableColumn>
        <FTableColumn
            label="操作"
            align="center"
            :width="200"
            :action="action"
            fixed="right"
        ></FTableColumn>
    </FTable>
</template>
<script>
import { reactive } from 'vue';

const createData = (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push({
            date: `2016-05-${i < 10 ? '0' + i : i}`,
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
        });
    }
    return arr;
};

export default {
    setup() {
        const data = reactive(createData(10000));
        const action = [
            {
                label: '编辑',
                func: (row) => {
                    console.log('[table.virtual] [action.编辑] row:', row);
                },
            },
            {
                label: '删除',
                func: (row) => {
                    console.log('[table.virtual] [action.删除] row:', row);
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
