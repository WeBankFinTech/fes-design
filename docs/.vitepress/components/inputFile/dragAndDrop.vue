<template>
    <FForm layout="inline" :inlineItemWidth="120">
        <FFormItem label="多选:">
            <FSwitch v-model="multiple" />
        </FFormItem>
        <FFormItem label="禁用:">
            <FSwitch v-model="disabled" />
        </FFormItem>
    </FForm>

    <FDivider />

    <FInputFileDragger
        :multiple="multiple"
        :disabled="disabled"
        :accept="['.pdf']"
        @change="handleChange"
    >
        点击或者拖拽文件到此区域
    </FInputFileDragger>
</template>

<script setup>
import { ref } from 'vue';

const multiple = ref(false);
const disabled = ref(false);

const handleChange = (files) =>
    console.log('[inputFile.basic]', '[handleChange]', files);
</script>
