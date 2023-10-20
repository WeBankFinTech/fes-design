<template>
    <FForm>
        <FFormItem label="是否展示表格边框:">
            <FRadioGroup
                v-model="bordered"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否展示水平分割线:">
            <FRadioGroup
                v-model="horizontalLine"
                :options="[
                    { label: '否', value: false },
                    { label: '是(默认)', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否展示垂直分割线:">
            <FRadioGroup
                v-model="verticalLine"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTable
        :bordered="bordered"
        :horizontalLine="horizontalLine"
        :verticalLine="verticalLine"
        :data="data"
    >
        <FTableColumn prop="date" label="日期"></FTableColumn>
        <FTableColumn prop="name" label="姓名"></FTableColumn>
        <FTableColumn prop="address" label="地址"></FTableColumn>
    </FTable>
</template>
<script>
import { reactive, defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const bordered = ref(false);
        const horizontalLine = ref(true);
        const verticalLine = ref(false);

        const data = reactive(
            Array.from([1, 2, 3], (i) => {
                return {
                    date: `2016-05-${i < 10 ? '0' + i : i}`,
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        return {
            bordered,
            horizontalLine,
            verticalLine,
            data,
        };
    },
});
</script>
