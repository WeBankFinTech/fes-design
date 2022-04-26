<template>
    <div class="text-tips">单选：</div>
    <FCascaderV1 v-model="value" :disabled="true" :options="options">
    </FCascaderV1>
    <div class="text-tips">多选：</div>
    <FCascaderV1
        v-model="multipleValue"
        :multiple="true"
        :disabled="true"
        :options="options"
    >
    </FCascaderV1>
    <div class="text-tips">折叠选中项（默认1项起）：</div>
    <FCascaderV1
        v-model="multipleValue"
        :multiple="true"
        :disabled="true"
        collapseTags
        :options="options"
    >
    </FCascaderV1>
    <div class="text-tips">折叠选中项（2项起）：</div>
    <FCascaderV1
        v-model="multipleValue"
        :multiple="true"
        :disabled="true"
        collapseTags
        :collapseTagsLimit="2"
        :options="options"
    >
    </FCascaderV1>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';

const options = [
    {
        value: '140000',
        label: '山西省',
    },
    {
        value: '210000',
        label: '辽宁省',
    },
    {
        value: '220000',
        label: '吉林省',
    },
    {
        value: '230000',
        label: '黑龙江省',
    },
    {
        value: '310000',
        label: '上海',
    },
    {
        value: '320000',
        label: '江苏省',
    },
    {
        value: '330000',
        label: '浙江省',
    },
    {
        value: '340000',
        label: '安徽省',
    },
];

export default defineComponent({
    setup() {
        const state = reactive({
            value: '140000',
            multipleValue: ['140000', '210000', '220000'],
        });

        return {
            ...toRefs(state),
            options,
        };
    },
});
</script>

<style scoped>
.fes-cascader {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
