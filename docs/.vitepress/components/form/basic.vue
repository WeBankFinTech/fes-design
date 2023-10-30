<template>
    <FForm :labelWidth="100">
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
        <FFormItem label="这是一段长的表单项描述" align="center">
            <FInput placeholder="请输入"></FInput>
        </FFormItem>
        <FFormItem label="年龄范围">
            <FCheckboxGroup>
                <FCheckbox :value="1 - 5">1 - 5</FCheckbox>
                <FCheckbox :value="6 - 10">6 - 10</FCheckbox>
                <FCheckbox :value="11 - 15">11 - 15</FCheckbox>
                <FCheckbox :value="16 - 20">16 - 20</FCheckbox>
                <FCheckbox :value="21 - 25">21 - 25</FCheckbox>
                <FCheckbox :value="26 - 30">26 - 30</FCheckbox>
                <FCheckbox :value="31 - 35">31 - 35</FCheckbox>
                <FCheckbox :value="36 - 40">36 - 40</FCheckbox>
                <FCheckbox :value="41 - 45">41 - 45</FCheckbox>
                <FCheckbox :value="36 - 40">36 - 40</FCheckbox>
                <FCheckbox :value="41 - 45">41 - 45</FCheckbox>
                <FCheckbox :value="46 - 50">46 - 50</FCheckbox>
                <FCheckbox :value="51 - 55">51 - 55</FCheckbox>
                <FCheckbox :value="56 - 60">56 - 60</FCheckbox>
                <FCheckbox :value="61 - 65">61 - 65</FCheckbox>
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
<style scoped></style>
