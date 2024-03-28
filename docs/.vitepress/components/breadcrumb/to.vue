<template>
    <FForm :labelWidth="60">
        <FFormItem label="replace:">
            <FRadioGroup
                v-model="replace"
                :options="[
                    { label: 'true', value: true },
                    { label: 'false(默认)', value: false },
                ]"
            />
        </FFormItem>
    </FForm>
    <FDivider></FDivider>
    <FBreadcrumb>
        <FBreadcrumbItem to="/" :replace="replace">首页</FBreadcrumbItem>
        <FBreadcrumbItem to="/zh/components/button.html" :replace="replace">
            按钮组件介绍
        </FBreadcrumbItem>
    </FBreadcrumb>
</template>

<script setup>
import { ref } from 'vue';

const replace = ref(false);
</script>
