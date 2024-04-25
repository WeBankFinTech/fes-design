<template>
    <FForm :labelWidth="100">
        <FFormItem label="展示模式:">
            <FRadioGroup
                v-model="mode"
                :options="[
                    { label: '水平模式', value: 'horizontal' },
                    { label: '垂直模式', value: 'vertical' },
                ]"
            />
        </FFormItem>
        <FFormItem label="触发方式:">
            <FRadioGroup
                v-model="trigger"
                :options="[
                    { label: mode === 'horizontal' ? 'hover(默认)' : 'hover', value: 'hover' },
                    { label: mode === 'vertical' ? 'click(默认)' : 'click', value: 'click' },
                ]"
            />
        </FFormItem>
    </FForm>
    <FDivider />
    <div style="width: 200px">
        <FMenu :trigger="trigger" :options="options" :mode="mode" />
    </div>
</template>

<script setup>
import { h, ref, watch } from 'vue';
import { AppstoreOutlined } from '@fesjs/fes-design/icon';

const mode = ref('horizontal');

const trigger = ref('hover');

const options = [
    {
        label: '华中地区',
        icon: () => h(AppstoreOutlined),
        value: '1',
        children: [
            {
                label: '湖南',
                value: '1.1',
            },
            {
                label: '湖北',
                value: '1.2',
                children: [
                    {
                        label: '武汉市',
                        value: '1.2,1',
                    },
                    {
                        label: '仙桃市',
                        value: '1.2,2',
                    },
                    {
                        label: '孝感市',
                        value: '1.2.3',
                    },
                ],
            },
        ],
    },
    {
        label: '华南地区',
        icon: () => h(AppstoreOutlined),
        value: '2',
        children: [
            {
                label: '云南',
                value: '2.1',
            },
            {
                label: '广东',
                value: '2.2',
            },
            {
                label: '广西',
                value: '2.3',
            },
        ],
    },
];

watch(mode, () => {
    if (mode.value === 'horizontal') {
        trigger.value = 'hover';
    } else {
        trigger.value = 'click';
    }
});
</script>
