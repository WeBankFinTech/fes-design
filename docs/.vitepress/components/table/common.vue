<template>
    <FForm labelWidth="150px">
        <FFormItem label="列宽度设置方式:">
            <FRadioGroup
                v-model="layout"
                :options="[
                    { label: '等分(默认)', value: 'fixed' },
                    { label: '按内容自动调整大小比例', value: 'auto' },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否开启 hover 行样式:">
            <FRadioGroup
                v-model="hoverable"
                :options="[
                    { label: '是(默认)', value: true },
                    { label: '否', value: false },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否开启斑马线条纹:">
            <FRadioGroup
                v-model="striped"
                :options="[
                    { label: '是', value: true },
                    { label: '否(默认)', value: false },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTable
        :data="data"
        :layout="layout"
        :hoverable="hoverable"
        :striped="striped"
    >
        <FTableColumn prop="date" label="日期">
            <template #default="{ row }">
                {{ row.date }}
            </template>
        </FTableColumn>
        <FTableColumn prop="name" label="姓名"></FTableColumn>
        <FTableColumn prop="address" label="地址"></FTableColumn>
    </FTable>
</template>

<script setup>
import { reactive, ref } from 'vue';
const data = reactive(
    Array.from([1, 2, 3], (i) => {
        return {
            date: `2016-05-${i < 10 ? '0' + i : i}`,
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
        };
    }),
);
const layout = ref('fixed');
const hoverable = ref(true);
const striped = ref(true);
</script>
