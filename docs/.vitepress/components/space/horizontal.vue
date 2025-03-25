<template>
    <FForm labelWidth="100px">
        <FFormItem label="是否换行:">
            <FRadioGroup
                v-model="wrap"
                :options="[
                    { label: '是(默认)', value: true },
                    { label: '否', value: false },
                ]"
            />
        </FFormItem>
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
    </FForm>

    <FDivider />

    <FSpace :justify="justify" :align="align" :wrap="wrap">
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <!-- 注释 -->
        <FButton>
            Long! Long! Long! Long! Long! Long! Long! Long! Long! Long! Cross
            Cross the line!
        </FButton>
    </FSpace>

    <FDivider />

    <div class="space-wrapper">
        <FSpace :justify="justify" :align="align" :wrap="wrap">
            Text
            <FButton>Button</FButton>

            <div class="box-wrapper">
                <FSpace vertical>
                    Text
                    <FButton>Button</FButton>
                </FSpace>
            </div>
        </FSpace>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const align = ref('center');
const justify = ref('start');
const wrap = ref(true);
</script>

<style scoped>
.space-wrapper {
    width: 100%;
    padding: 8px;
    border: 1px dashed #ccc;
}
.box-wrapper {
    border: 1px dashed #ccc;
    padding: 8px;
}
</style>
