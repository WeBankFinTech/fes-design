<template>
    <FForm :labelWidth="100">
        <FFormItem label="是否默认:">
            <FRadioGroup
                v-model="isDefault"
                :options="[
                    { label: '自定义', value: false },
                    { label: '是（默认）', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem v-if="!isDefault" label="触发方式:">
            <FRadioGroup
                v-model="trigger"
                :options="[
                    { label: 'hover', value: 'hover' },
                    { label: 'click', value: 'click' },
                ]"
            />
        </FFormItem>
    </FForm>
    <FDivider></FDivider>
    <FMenu :trigger="trigger" :options="options"></FMenu>
    <div style="width: 200px">
        <FMenu :trigger="trigger" :options="options" mode="vertical"></FMenu>
    </div>
</template>

<script setup>
import { ref, h, watch } from 'vue';
import { AppstoreOutlined } from '@fesjs/fes-design/icon';

const isDefault = ref(true);

const trigger = ref();

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

watch(isDefault, () => {
    if (isDefault.value) {
        trigger.value = null;
    }
});
</script>
