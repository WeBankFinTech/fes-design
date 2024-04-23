<template>
    <FForm labelWidth="120px">
        <FFormItem label="行间距:">
            <FInputNumber
                v-model="inlineItemGap"
                :min="5"
                :max="30"
                :step="1"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="每项宽度设置方式:">
            <FRadioGroup
                v-model="itemWidthType"
                :options="[
                    { label: '占据列数', value: 'span' },
                    { label: '固定宽度', value: 'inlineItemWidth' },
                ]"
            />
        </FFormItem>
        <FFormItem v-if="itemWidthType === 'span'" label="占据列数：">
            <FInputNumber
                v-model="span"
                :min="6"
                :max="24"
                :step="1"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem
            v-if="itemWidthType === 'inlineItemWidth'"
            label="固定宽度："
        >
            <FInputNumber
                v-model="inlineItemWidth"
                :min="100"
                :max="500"
                :step="10"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
    </FForm>

    <FDivider />

    <FForm
        layout="inline"
        labelWidth="100px"
        labelPosition="right"
        :inlineItemGap="inlineItemGap"
        :span="itemWidthType === 'span' ? span : undefined"
        :inlineItemWidth="
            itemWidthType === 'inlineItemWidth' ? inlineItemWidth : undefined
        "
    >
        <FFormItem label="输入姓名">
            <FInput placeholder="请输入" />
        </FFormItem>
        <FFormItem label="选择城市">
            <FSelect clearable placeholder="请单选">
                <FOption
                    v-for="(item, index) in optionList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                />
            </FSelect>
        </FFormItem>
        <FFormItem label="选择城市">
            <FSelect clearable placeholder="请单选">
                <FOption
                    v-for="(item, index) in optionList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                />
            </FSelect>
        </FFormItem>
        <FFormItem label="选择性别">
            <FRadioGroup>
                <FRadio :value="0">未知</FRadio>
                <FRadio :value="1">男</FRadio>
                <FRadio :value="2">女</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="输入其他">
            <FInput placeholder="请输入" />
        </FFormItem>
        <FFormItem label="选择性别" align="center">
            <FRadioGroup>
                <FRadio :value="0">未知</FRadio>
                <FRadio :value="1">男</FRadio>
                <FRadio :value="2">女</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const inlineItemGap = ref(11);
        const itemWidthType = ref('span');
        const span = ref(12);
        const inlineItemWidth = ref(300);

        return {
            inlineItemGap,
            itemWidthType,
            span,
            inlineItemWidth,

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
});
</script>
