<template>
    <FForm labelWidth="120px">
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
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="总是显示滚动条：">
            <FRadioGroup
                v-model="alwaysScrollbar"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FTable
        :virtualScroll="virtualScroll"
        :height="isFixedHeight ? height : undefined"
        rowKey="date"
        :data="data"
        :alwaysScrollbar="alwaysScrollbar"
    >
        <FTableColumn prop="date" label="日期" :width="150" ellipsis fixed />
        <FTableColumn prop="name" label="姓名" :width="150" />
        <FTableColumn prop="province" label="省份" :width="150" />
        <FTableColumn prop="city" label="市区" :width="150" />
        <FTableColumn prop="address" label="地址" :width="800" />
        <FTableColumn prop="zip" label="邮编" :width="120" />
        <FTableColumn
            label="操作"
            align="center"
            :width="200"
            :action="action"
            fixed="right"
        />
    </FTable>
</template>
<script>
import { reactive, ref } from 'vue';

const createData = (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push({
            date: `2016-05-${i < 10 ? `0${i}` : i}`,
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
        const alwaysScrollbar = ref(false);

        const data = reactive(createData(200));
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
            alwaysScrollbar,
        };
    },
};
</script>
