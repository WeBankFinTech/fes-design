<template>
    <FForm>
        <FFormItem label="按钮边框:">
            <FRadioGroup
                v-model="bordered"
                :cancelable="false"
                :options="[
                    { label: '有边框(默认)', value: true },
                    { label: '无边框', value: false },
                ]"
            />
        </FFormItem>
        <FFormItem label="按钮大小:">
            <FRadioGroup
                v-model="size"
                :cancelable="false"
                :options="[
                    { label: 'middle(默认)', value: 'middle' },
                    { label: 'small', value: 'small' },
                ]"
            />
        </FFormItem>
        <FFormItem label="按钮样式:">
            <FRadioGroup
                v-model="type"
                :cancelable="false"
                :options="[
                    { label: 'default(默认)', value: 'default' },
                    { label: 'primary', value: 'primary' },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace>
        <FRadioGroup
            v-model="val1"
            :size="size"
            :type="type"
            :bordered="bordered"
            :cancelable="false"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3" disabled>选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
        <FRadioGroup
            v-model="val2"
            :size="size"
            :type="type"
            :bordered="bordered"
            :cancelable="true"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
        </FRadioGroup>
    </FSpace>
</template>
<script setup>
import { ref } from 'vue';

const val1 = ref(1);
const val2 = ref(1);

const handleChange = (value) => {
    console.log('[radio.button] [handleChange] value:', value);
};

const bordered = ref(true);
const size = ref('middle');
const type = ref('default');
</script>
