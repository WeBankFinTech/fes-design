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
    </FForm>

    <FDivider />

    <FSpace>
        <FLink :underline="underline" :size="size" type="primary">primary</FLink>
        <FLink :underline="underline" :size="size" type="success">success</FLink>
        <FLink :underline="underline" :size="size" type="warning">warning</FLink>
        <FLink :underline="underline" :size="size" type="danger">danger</FLink>
        <FLink :underline="underline" disabled :size="size">disabled</FLink>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref('middle');

const underline = ref(true);
</script>

<style scoped>
.fes-link {
    margin-right: 8px;
}
</style>
