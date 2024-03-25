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

    <FInputFile
        :multiple="multiple"
        :disabled="disabled"
        :accept="['image/*']"
        @change="handleChange"
    />
</template>

<script setup>
import { ref } from 'vue';

const multiple = ref(false);
const disabled = ref(false);

const handleChange = (files) =>
    console.log('[inputFile.basic]', '[handleChange]', files);
</script>
