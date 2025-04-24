<template>
    <FForm labelWidth="120px">
        <FFormItem label="垂直排列:">
            <FRadioGroup
                v-model="align"
                :options="[
                    { label: 'start(默认)', value: 'start' },
                    { label: 'end', value: 'end' },
                    { label: 'center', value: 'center' },
                    { label: 'baseline', value: 'baseline' },
                    { label: 'stretch', value: 'stretch' },
                ]"
            />
        </FFormItem>
        <FFormItem label="水平排列:">
            <FRadioGroup
                v-model="justify"
                :options="[
                    { label: 'start(默认)', value: 'start' },
                    { label: 'end', value: 'end' },
                    { label: 'center', value: 'center' },
                    { label: 'space-around', value: 'space-around' },
                    { label: 'space-between', value: 'space-between' },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否包裹子元素:">
            <FRadioGroup
                v-model="wrapItem"
                :options="[
                    { label: 'true(默认)', value: true },
                    { label: 'false', value: false },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace
        class="space-wrapper"
        vertical
        :justify="justify"
        :align="align"
        :wrapItem="wrapItem"
        style="min-height: 200px"
    >
        <FButton>Text</FButton>
        <FButton>Checkbox</FButton>
        <FButton>Input</FButton>
        <FButton>
            Long! Long! Long! Long! Long! Long! Long! Long! Long! Long! Cross
            Cross the line!
        </FButton>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const align = ref('start');
const justify = ref('start');
const wrapItem = ref(true);
</script>

<style scoped>
.space-wrapper {
    border: 1px dashed #ccc;
    padding: 8px;
}
</style>
