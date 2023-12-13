<template>
    <FForm :labelWidth="100">
        <FFormItem label="是否隐藏:">
            <FRadioGroup
                v-model="hidden"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="是否展示数据0:">
            <FRadioGroup
                v-model="showZero"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <FBadge :hidden="hidden" :value="0" :showZero="showZero" class="item">
            <FButton> Primary </FButton>
        </FBadge>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const hidden = ref(false);
const showZero = ref(false);
</script>

<style>
.item {
    margin-right: 20px;
}
</style>
