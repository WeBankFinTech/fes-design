<template>
    <FForm labelWidth="120px">
        <FFormItem label="表单禁用:">
            <FSwitch v-model="formDisabled" />
        </FFormItem>
        <FFormItem label="单项禁用:">
            <FRadioGroup
                v-model="formItemDisabled"
                :cancelable="true"
                :options="[
                    { label: '禁用', value: true },
                    { label: '不禁用', value: false },
                ]"
            />
            （{{ String(formItemDisabled) }}）
        </FFormItem>
    </FForm>

    <FDivider />

    <FForm :labelWidth="80" :disabled="formDisabled">
        <FFormItem label="输入框" :disabled="formItemDisabled">
            <FInput placeholder="请输入" />
        </FFormItem>
        <FFormItem label="文本输入">
            <FInput placeholder="请输入文本内容" type="textarea" />
        </FFormItem>
        <FFormItem label="数字输入">
            <FInputNumber v-model="numVal" :max="100" />
        </FFormItem>
        <FFormItem label="选择器">
            <FSelect clearable placeholder="请单选">
                <FOption
                    v-for="(item, index) in optionList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                />
            </FSelect>
        </FFormItem>
        <FFormItem label="单选框">
            <FRadioGroup>
                <FRadio :value="1">男</FRadio>
                <FRadio :value="2">女</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="单选按钮组">
            <FRadioGroup v-model="radioBtnVal">
                <FRadioButton :value="1">选项一</FRadioButton>
                <FRadioButton :value="2">选项二</FRadioButton>
                <FRadioButton :value="3">选项三</FRadioButton>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="复选框">
            <FCheckboxGroup>
                <FCheckbox :value="1 - 10">1-10</FCheckbox>
                <FCheckbox :value="11 - 30">11-30</FCheckbox>
                <FCheckbox :value="31 - 60">31-60</FCheckbox>
            </FCheckboxGroup>
        </FFormItem>
        <FFormItem label="开关">
            <FSwitch v-model="toggleVal" />
        </FFormItem>
        <FFormItem label="时间选择">
            <FTimePicker
                style="width: 200px"
                modelValue="22:22:22"
                placeholder="请输入"
            />
        </FFormItem>
        <FFormItem label="日期选择">
            <FDatePicker type="year" placeholder="选择年份" />
        </FFormItem>
        <FFormItem label="上传">
            <FUpload />
        </FFormItem>
        <FFormItem label="拖拽上传">
            <FUpload>
                <FUploadDragger> 点击或者拖拽文件到此区域 </FUploadDragger>
            </FUpload>
        </FFormItem>
        <FFormItem label="树形选择器">
            <FSelectTree />
        </FFormItem>
        <FFormItem label="级联选择器">
            <FSelectCascader />
        </FFormItem>
        <FFormItem label=" ">
            <FButton type="primary">Submit</FButton>
        </FFormItem>
    </FForm>
</template>

<script setup>
import { ref } from 'vue';

const formDisabled = ref(true);
const formItemDisabled = ref();
const toggleVal = ref();
const numVal = ref(0);
const radioBtnVal = ref(0);

const optionList = [
    {
        value: 'HuNan',
        label: '湖南',
    },
    {
        value: 'HuBei',
        label: '湖北',
    },
    {
        value: 'ZheJiang',
        label: '浙江',
    },
    {
        value: 'GuangDong',
        label: '广东',
    },
    {
        value: 'JiangSu',
        label: '江苏',
    },
];
</script>

<style scoped></style>
