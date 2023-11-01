<template>
    <FForm labelWidth="100px">
        <FFormItem label="按钮大小:">
            <FRadioGroup
                v-model="size"
                :options="[
                    { label: 'small', value: 'small' },
                    { label: 'middle(默认)', value: 'middle' },
                    { label: 'large', value: 'large' },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否加载状态:">
            <FRadioGroup
                v-model="loading"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否禁用状态:">
            <FRadioGroup
                v-model="disabled"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <FButton :size="size" :loading="loading" :disabled="disabled">
            Default
        </FButton>
        <FButton
            type="primary"
            :size="size"
            :loading="loading"
            :disabled="disabled"
        >
            Primary
        </FButton>
        <FButton
            type="text"
            :size="size"
            :loading="loading"
            :disabled="disabled"
        >
            Text
        </FButton>
        <FButton
            type="link"
            :size="size"
            :loading="loading"
            :disabled="disabled"
        >
            Link
        </FButton>
    </FSpace>

    <FDivider></FDivider>

    <FSpace>
        <FButton
            type="info"
            :size="size"
            :loading="loading"
            :disabled="disabled"
        >
            Info
        </FButton>
        <FButton
            type="success"
            :size="size"
            :loading="loading"
            :disabled="disabled"
        >
            Success
        </FButton>
        <FButton
            type="warning"
            :size="size"
            :loading="loading"
            :disabled="disabled"
        >
            Warning
        </FButton>
        <FButton
            type="danger"
            :size="size"
            :loading="loading"
            :disabled="disabled"
        >
            Danger
        </FButton>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';
const size = ref('middle');
const loading = ref(false);
const disabled = ref(false);
</script>
