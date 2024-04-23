<template>
    <FForm labelWidth="100px">
        <FFormItem label="是否固定表头:">
            <FRadioGroup
                v-model="fixedHeader"
                :options="[
                    { label: '否', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否固定列:">
            <FRadioGroup
                v-model="fixedColumn"
                :options="[
                    { label: '否', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTable
        :data="data"
        bordered
        verticalLine
        :height="fixedHeader ? 350 : undefined"
    >
        <FTableColumn
            prop="date"
            label="日期"
            :ellipsis="{ tooltip: { popperClass: 'a', showAfter: 500 } }"
            :width="150"
            :fixed="fixedColumn ? 'left' : false"
        ></FTableColumn>
        <FTableColumn
            prop="name"
            label="姓名"
            :width="150"
            :fixed="fixedColumn ? 'left' : false"
        ></FTableColumn>
        <FTableColumn label="配送信息">
            <FTableColumn prop="name" label="姓名" :width="150"></FTableColumn>
            <FTableColumn label="地址信息">
                <FTableColumn
                    prop="province"
                    label="省份"
                    :width="150"
                ></FTableColumn>
                <FTableColumn prop="city" label="市区" :width="150">
                </FTableColumn>
                <FTableColumn
                    prop="address"
                    label="详细地址"
                    :width="500"
                ></FTableColumn>
                <FTableColumn prop="zip" label="邮编" :width="120">
                </FTableColumn>
            </FTableColumn>
        </FTableColumn>
        <FTableColumn
            prop="zip"
            label="邮编"
            :width="120"
            :fixed="fixedColumn ? 'right' : false"
        >
        </FTableColumn>
        <FTableColumn
            label="操作"
            align="center"
            :width="200"
            :action="action"
            :fixed="fixedColumn ? 'right' : false"
        ></FTableColumn>
    </FTable>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const data = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (i) => {
            return {
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

        const fixedHeader = ref(true);
        const fixedColumn = ref(false);

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
            data,
            fixedHeader,
            fixedColumn,
            action,
        };
    },
});
</script>
