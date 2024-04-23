<template>
    <FForm :labelWidth="160">
        <FFormItem label="展示类型：">
            <FRadioGroup v-model="emptyType">
                <FRadio value="normal">默认</FRadio>
                <FRadio value="custom">自定义</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="表格边框:">
            <FRadioGroup
                v-model="bordered"
                :cancelable="false"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="水平分割线:">
            <FRadioGroup
                v-model="horizontalLine"
                :cancelable="false"
                :options="[
                    { label: '否', value: false },
                    { label: '是(默认)', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="垂直分割线:">
            <FRadioGroup
                v-model="verticalLine"
                :cancelable="false"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="间距大小：">
            <FRadioGroup v-model="size">
                <FRadio value="middle">middle(默认)</FRadio>
                <FRadio value="small">small</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="自定义空数据文本：">
            <FInput v-model="emptyText"></FInput>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTable
        v-if="emptyType === 'normal'"
        :data="data"
        :size="size"
        :bordered="bordered"
        :horizontalLine="horizontalLine"
        :verticalLine="verticalLine"
        :emptyText="emptyText || '暂无数据'"
    >
        <FTableColumn :width="200" prop="date" label="日期"></FTableColumn>
        <FTableColumn :width="200" prop="name" label="姓名"></FTableColumn>
        <FTableColumn :width="200" prop="address" label="地址"></FTableColumn>
        <FTableColumn :width="200" prop="contact" label="联系人"></FTableColumn>
        <FTableColumn :width="200" prop="postcode" label="邮编"></FTableColumn>
    </FTable>

    <FTable
        v-if="emptyType === 'custom'"
        :data="data"
        :size="size"
        :bordered="bordered"
        :horizontalLine="horizontalLine"
        :verticalLine="verticalLine"
    >
        <template #empty>
            <FEmpty :description="emptyText" />
        </template>
        <FTableColumn :width="200" prop="date" label="日期"></FTableColumn>
        <FTableColumn :width="200" prop="name" label="姓名"></FTableColumn>
        <FTableColumn :width="200" prop="address" label="地址"></FTableColumn>
        <FTableColumn :width="200" prop="contact" label="联系人"></FTableColumn>
        <FTableColumn :width="200" prop="postcode" label="邮编"></FTableColumn>
    </FTable>
</template>
<script setup>
import { reactive, ref } from 'vue';

const emptyType = ref('normal');
const size = ref('middle');
const emptyText = ref();

const bordered = ref(false);
const horizontalLine = ref(true);
const verticalLine = ref(false);

const data = reactive([]);
</script>
