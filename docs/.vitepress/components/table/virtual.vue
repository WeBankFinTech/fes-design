<template>
    <FForm labelWidth="100px">
        <FFormItem label="是否虚拟滚动:">
            <FRadioGroup
                v-model="virtualScroll"
                :options="[
                    { label: '否', value: false },
                    { label: '是', value: true },
                ]"
                @change="() => virtualScroll && (isFixedHeight = true)"
            />
        </FFormItem>
        <FFormItem label="是否指定高度:">
            <FRadioGroup
                v-model="isFixedHeight"
                :disabled="virtualScroll"
                :options="[
                    { label: '否', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem v-if="isFixedHeight" label="固定高度：">
            <FInputNumber
                v-model="height"
                :min="50"
                :max="1000"
                :step="50"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTable
        :virtualScroll="virtualScroll"
        :height="isFixedHeight ? height : undefined"
        rowKey="date"
        :data="data"
    >
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
import { reactive, ref } from 'vue';

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
        const virtualScroll = ref(true);
        const isFixedHeight = ref(true);
        const height = ref(250);

        const data = reactive(createData(5));
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
            virtualScroll,
            isFixedHeight,
            height,
        };
    },
};
</script>
