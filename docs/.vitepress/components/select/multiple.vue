<template>
    <FForm :labelWidth="200">
        <FFormItem label="选中项展示是否有边框：">
            <FRadioGroup v-model="tagBordered">
                <FRadio :value="false">false(默认)</FRadio>
                <FRadio :value="true">true</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="多选是否折叠展示：">
            <FRadioGroup v-model="collapseTags">
                <FRadio :value="false">false(默认)</FRadio>
                <FRadio :value="true">true</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-if="collapseTags" label="折叠项限制：">
            <FRadioGroup v-model="collapseTagsLimit">
                <FRadio :value="1">1(默认)</FRadio>
                <FRadio :value="2">2</FRadio>
                <FRadio :value="3">3</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSelect
        v-model="arr"
        multiple
        clearable
        :tagBordered="tagBordered"
        :collapseTags="collapseTags"
        :collapseTagsLimit="collapseTagsLimit"
    >
        <FOption
            v-for="(item, index) in optionList"
            :key="index"
            :value="item.value"
            :label="item.label"
        ></FOption>
    </FSelect>
</template>
<script>
import { reactive, ref } from 'vue';

export default {
    setup() {
        const arr = ref([]);
        const optionList = reactive([
            {
                value: 'HuNan',
                label: '湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南',
            },
            {
                value: 'HuBei',
                label: '湖北',
                disabled: true,
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
        ]);

        const tagBordered = ref(false);
        const collapseTags = ref(true);
        const collapseTagsLimit = ref(1);

        return {
            optionList,
            tagBordered,
            collapseTags,
            collapseTagsLimit,
            arr,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
