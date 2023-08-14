<template>
    <FForm :labelWidth="160">
        <FFormItem label="字体加粗：">
            <FRadioGroup v-model="isStrong">
                <FRadio :value="false">否</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="字体倾斜：">
            <FRadioGroup v-model="IsItalic">
                <FRadio :value="false">否</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="元素标签：">
            <FRadioGroup v-model="tag">
                <FRadio value="">span(默认)</FRadio>
                <FRadio value="div">div</FRadio>
                <FRadio value="p">p</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>
    <FSpace>
        <FText :strong="isStrong" :italic="IsItalic" :tag="tag">
            这是一段文字
        </FText>
    </FSpace>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const isStrong = ref(true);
const IsItalic = ref(true);
const tag = ref('');
</script>
