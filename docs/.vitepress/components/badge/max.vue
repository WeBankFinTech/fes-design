<template>
    <FForm :labelWidth="100">
        <FFormItem label="封顶阈值:">
            <FInputNumber v-model="max" :step="1"></FInputNumber>
        </FFormItem>
        <FFormItem label="内容值:">
            <FInputNumber v-model="value" :step="1"></FInputNumber>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <FBadge :value="value" type="primary" :max="max" class="item">
            <FButton> Primary </FButton>
        </FBadge>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const max = ref(100);
const value = ref(100);
</script>

<style>
.item {
    margin-right: 20px;
}
</style>
