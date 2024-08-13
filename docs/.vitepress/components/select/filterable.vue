<template>
    <FForm>
        <FFormItem label="是否高亮:">
            <FRadioGroup
                v-model="filterTextHighlight"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FForm :labelWidth="130">
        <FFormItem label="默认:">
            <FSelect filterable clearable :options="optionList" :filterTextHighlight="filterTextHighlight" />
        </FFormItem>
        <FFormItem label="自定义过滤函数:">
            <FSelect filterable :filter="filter" :options="optionList" :filterTextHighlight="filterTextHighlight" />
        </FFormItem>
        <FFormItem label="创建新选项:">
            <FSelect
                style="width: 200px"
                :options="cityOptions"
                tag
                filterable
                multiple
                filterTextHighlight
            />
        </FFormItem>
        <FFormItem label="自定义选项模板:">
            <FSelect filterable @filter="(query) => { filterText = query }">
                <FSelectGroupOption
                    v-for="group in cityOptions"
                    :key="group.label"
                    :label="group.label"
                    :disabled="group.disabled"
                >
                    <FOption
                        v-for="item in group.children"
                        :key="item.label"
                        :value="item.value"
                    >
                        <FTextHighlight :searchValues="[filterText]" strict>{{ item.label }}</FTextHighlight>
                    </FOption>
                </FSelectGroupOption>
            </FSelect>
        </FFormItem>
    </FForm>
</template>

<script setup>
import { reactive, ref } from 'vue';

const filterText = ref('');
const filterTextHighlight = ref(false);

const optionList = reactive([
    {
        value: 'HuNan',
        label: '湖南',
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

const cityOptions = [
    {
        label: '华中地区',
        children: [
            {
                value: '湖北',
                label: '湖北',
            },
            {
                value: '湖南',
                label: '湖南',
            },
            {
                value: '河南',
                label: '河南',
            },
            {
                value: '江西',
                label: '江西',
            },
        ],
    },
    {
        label: '华南地区',
        disabled: true,
        children: [
            {
                value: '广东',
                label: '广东',
            },
            {
                value: '广西',
                label: '广西',
            },
            {
                value: '海南',
                label: '海南',
            },
        ],
    },
];

const filter = (text, option) => {
    return option.label.indexOf(text) !== -1;
};
</script>

<style scoped>
.fes-select {
    width: 200px;
}
</style>
