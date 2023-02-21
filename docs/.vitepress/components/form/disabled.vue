<template>
    <FSpace>
        <div>表单禁用</div>
        <FSwitch v-model="formToggle" @change="handleChange"></FSwitch>
    </FSpace>
    <FDivider></FDivider>
    <FForm :labelWidth="80" :disabled="formToggle">
        <FFormItem label="输入姓名">
            <FInput placeholder="请输入"></FInput>
        </FFormItem>
        <FFormItem label="输入数字">
            <FInputNumber v-model="numVal" :max="100"></FInputNumber>
        </FFormItem>
        <FFormItem label="选择城市">
            <FSelect clearable placeholder="请单选">
                <FOption
                    v-for="(item, index) in optionList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                ></FOption>
            </FSelect>
        </FFormItem>
        <FFormItem label="选择性别">
            <FRadioGroup>
                <FRadio :value="1">男</FRadio>
                <FRadio :value="2">女</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="年龄范围">
            <FCheckboxGroup>
                <FCheckbox :value="1 - 10">1-10</FCheckbox>
                <FCheckbox :value="11 - 30">11-30</FCheckbox>
                <FCheckbox :value="31 - 60">31-60</FCheckbox>
            </FCheckboxGroup>
        </FFormItem>
        <FFormItem label="开关">
            <FSwitch v-model="toggleVal" @change="handleChange"></FSwitch>
        </FFormItem>
        <FFormItem label="时间选择">
            <FTimePicker
                style="width: 200px"
                modelValue="22:22:22"
                placeholder="请输入"
            ></FTimePicker>
        </FFormItem>
        <FFormItem label="日期选择">
            <FDatePicker type="year" placeholder="选择年份" />
        </FFormItem>
        <FFormItem label="上传">
            <FUpload></FUpload>
        </FFormItem>
        <FFormItem label="树形选择器">
            <FSelectTree></FSelectTree>
        </FFormItem>
        <FFormItem label="级联选择器">
            <FSelectCascader></FSelectCascader>
        </FFormItem>
        <FFormItem label=" ">
            <FButton type="primary">Submit</FButton>
        </FFormItem>
    </FForm>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const formToggle = ref(true);
        const toggleVal = ref();
        const numVal = ref(0);
        const handleChange = (value) => {
            console.log('change:', value);
        };
        return {
            optionList: [
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
            ],
            handleChange,
            toggleVal,
            numVal,
            formToggle,
        };
    },
};
</script>
<style scoped>
.fes-form {
    width: 600px;
}
</style>
