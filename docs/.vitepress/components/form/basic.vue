<template>
    <FForm :labelWidth="80">
        <FFormItem label="输入姓名">
            <FInput placeholder="请输入"></FInput>
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
        <FFormItem label=" ">
            <FButton type="primary">Submit</FButton>
        </FFormItem>
    </FForm>
</template>
<script>
export default {
    setup() {
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
        };
    },
};
</script>
<style scoped>
.fes-form {
    width: 600px;
}
</style>
