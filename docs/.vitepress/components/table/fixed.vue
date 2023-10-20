<template>
    <FForm labelWidth="100px">
        <FFormItem label="是否固定列:">
            <FRadioGroup
                v-model="fixedCol"
                :options="[
                    { label: '否', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTable :data="data" bordered>
        <FTableColumn
            type="selection"
            :width="30"
            :fixed="fixedCol ? 'left' : undefined"
        ></FTableColumn>
        <FTableColumn
            prop="date"
            label="日期"
            ellipsis
            :width="150"
            :fixed="fixedCol ? true : undefined"
        ></FTableColumn>
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
            :fixed="fixedCol ? 'right' : undefined"
        ></FTableColumn>
    </FTable>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const height = ref(250);
        const fixedCol = ref(true);

        const data = Array.from([1, 2, 3], (i) => {
            return {
                date: `2016-05-2016-05-2016-05-2016-05-${i < 10 ? '0' + i : i}`,
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333,
            };
        });
        const action = [
            {
                label: '编辑',
                func: (row) => {
                    console.log('[table.scroll] [action.编辑] row:', row);
                },
            },
            {
                label: '删除',
                func: (row) => {
                    console.log('[table.scroll] [action.删除] row:', row);
                },
            },
        ];
        return {
            height,
            fixedCol,
            data,
            action,
        };
    },
};
</script>
