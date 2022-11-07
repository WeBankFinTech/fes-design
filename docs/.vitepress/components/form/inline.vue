<template>
    <FForm layout="inline">
        <FFormItem label="输入姓名">
            <FInput placeholder="请输入"></FInput>
        </FFormItem>
        <FFormItem label="选择城市" :span="10">
            <FSelect clearable placeholder="请单选">
                <FOption
                    v-for="(item, index) in optionList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                ></FOption>
            </FSelect>
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
        <FFormItem label="输入其他" :span="10">
            <FInput placeholder="请输入"></FInput>
        </FFormItem>
        <FFormItem label="选择性别">
            <FRadioGroup>
                <FRadio :value="1">男</FRadio>
                <FRadio :value="2">女</FRadio>
            </FRadioGroup>
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
                    label: '湖南湖南湖南湖南湖南湖南湖南',
                },
                {
                    value: 'HuBei',
                    label: '湖北湖北湖北湖北湖北湖北湖北',
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
