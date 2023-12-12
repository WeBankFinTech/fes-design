<template>
    <FForm :labelWidth="100">
        <FFormItem label="尺寸:">
            <FRadioGroup
                v-model="size"
                :options="[
                    { label: 'small', value: 'small' },
                    { label: 'middle(默认)', value: 'middle' },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否红点模式:">
            <FRadioGroup
                v-model="isDot"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否隐藏:">
            <FRadioGroup
                v-model="hidden"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <FBadge
            :size="size"
            :isDot="isDot"
            :hidden="hidden"
            :value="10"
            type="primary"
        >
            <FButton> Primary </FButton>
        </FBadge>
        <FBadge
            :size="size"
            :isDot="isDot"
            :hidden="hidden"
            :value="50"
            type="success"
        >
            <FButton> Success </FButton>
        </FBadge>
        <FBadge
            :size="size"
            :isDot="isDot"
            :hidden="hidden"
            :value="80"
            type="warning"
        >
            <FButton> Warning </FButton>
        </FBadge>
        <FBadge :size="size" :isDot="isDot" :hidden="hidden" :value="100">
            <FButton> Danger </FButton>
        </FBadge>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref('middle');
const isDot = ref(false);
const hidden = ref(false);
</script>

<style></style>
