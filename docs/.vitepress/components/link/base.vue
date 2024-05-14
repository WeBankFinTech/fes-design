<template>
    <FForm :labelWidth="60">
        <FFormItem label="尺寸:">
            <FRadioGroup
                v-model="size"
                :options="[
                    { label: 'small', value: 'small' },
                    { label: 'middle(默认)', value: 'middle' },
                    { label: 'large', value: 'large' },
                ]"
            />
        </FFormItem>
        <FFormItem label="下划线:">
            <FRadioGroup
                v-model="underline"
                :options="[
                    { label: '启用(默认)', value: true },
                    { label: '不启用', value: false },
                ]"
            />
        </FFormItem>
        <FFormItem label="禁用:">
            <FRadioGroup
                v-model="disabled"
                :options="[
                    { label: '是', value: true },
                    { label: '否(默认)', value: false },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace>
        <FLink :underline="underline" :disabled="disabled" :size="size" type="default">default</FLink>
        <FLink :underline="underline" :disabled="disabled" :size="size" type="primary">primary</FLink>
        <FLink :underline="underline" :disabled="disabled" :size="size" type="success">success</FLink>
        <FLink :underline="underline" :disabled="disabled" :size="size" type="warning">warning</FLink>
        <FLink :underline="underline" :disabled="disabled" :size="size" type="danger">danger</FLink>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref('middle');

const underline = ref(true);

const disabled = ref(false);
</script>

<style scoped>
.fes-link {
    margin-right: 8px;
}
</style>
