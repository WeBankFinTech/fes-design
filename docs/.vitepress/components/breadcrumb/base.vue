<template>
    <FForm :labelWidth="60">
        <FFormItem label="分隔符:">
            <FInput v-model="separator" class="form-item" />
        </FFormItem>
        <FFormItem label="字体大小:">
            <FInputNumber v-model="fontSize" class="form-item" />
        </FFormItem>
    </FForm>
    <FDivider />
    <FBreadcrumb :separator="separator" :fontSize="fontSize">
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
</script>

<style>
.form-item {
    width: 100px;
}
</style>
