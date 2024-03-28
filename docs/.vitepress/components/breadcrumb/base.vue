<template>
    <FForm :labelWidth="60">
        <FFormItem label="分隔符:">
            <FInput v-model="separator" class="form-item"></FInput>
        </FFormItem>
        <FFormItem label="字体大小:">
            <FInputNumber v-model="fontSize" class="form-item"></FInputNumber>
        </FFormItem>
        <FFormItem label="展示icon:">
            <FRadioGroup
                v-model="icon"
                :options="[
                    { label: 'true', value: true },
                    { label: 'false(默认)', value: false },
                ]"
            />
        </FFormItem>
    </FForm>
    <FDivider></FDivider>
    <FBreadcrumb :separator="separator" :fontSize="fontSize" :icon="icon">
        <FBreadcrumbItem>首页</FBreadcrumbItem>
        <FBreadcrumbItem>二级页面 </FBreadcrumbItem>
        <FBreadcrumbItem>三级页面</FBreadcrumbItem>
        <FBreadcrumbItem>四级页面</FBreadcrumbItem>
        <FBreadcrumbItem>五级页面</FBreadcrumbItem>
    </FBreadcrumb>
</template>

<script setup>
import { ref } from 'vue';

const separator = ref('/');

const fontSize = ref(14);

const icon = ref(false);
</script>

<style>
.form-item {
    width: 100px;
}
</style>
