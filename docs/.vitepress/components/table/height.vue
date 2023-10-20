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
        <FFormItem v-if="fixedHeader" label="固定高度：">
            <FInputNumber
                v-model="height"
                :min="50"
                :max="1000"
                :step="50"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="姓名列描述：">
            <FInput v-model="nameLabel" :maxlength="30" showWordLimit></FInput>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTable :data="data" bordered :height="fixedHeader ? height : undefined">
        <FTableColumn type="selection" :width="30"></FTableColumn>
        <FTableColumn
            prop="date"
            label="日期"
            ellipsis
            :width="150"
        ></FTableColumn>
        <FTableColumn
            prop="name"
            :label="nameLabel || '姓名'"
            :width="150"
        ></FTableColumn>
        <FTableColumn prop="province" label="省份" :width="150"></FTableColumn>
        <FTableColumn prop="city" label="市区" :width="150"> </FTableColumn>
        <FTableColumn prop="address" label="地址" :width="800"></FTableColumn>
        <FTableColumn prop="zip" label="邮编" :width="120"> </FTableColumn>
        <FTableColumn
            label="操作"
            align="center"
            :width="200"
            :action="action"
        ></FTableColumn>
    </FTable>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const fixedHeader = ref(true);
        const height = ref(250);
        const nameLabel = ref('姓名');

        const data = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (i) => {
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
            fixedHeader,
            height,
            nameLabel,
            data,
            action,
        };
    },
};
</script>
