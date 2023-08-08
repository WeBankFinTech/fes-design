<template>
    <FForm :labelWidth="160">
        <FFormItem label="间距类型：">
            <FRadioGroup v-model="sizeType">
                <FRadio value="same">水平和垂直相同</FRadio>
                <FRadio value="diff">水平和垂直不同</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-if="sizeType === 'same'" label="水平和垂直间距：">
            <FInputNumber
                v-model="sizeHV"
                :min="5"
                :max="50"
                :step="5"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem v-if="sizeType === 'diff'" label="水平间距：">
            <FInputNumber
                v-model="sizeH"
                :min="5"
                :max="50"
                :step="5"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem v-if="sizeType === 'diff'" label="垂直间距：">
            <FInputNumber
                v-model="sizeV"
                :min="5"
                :max="50"
                :step="5"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace :size="size">
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
    </FSpace>

    <FDivider></FDivider>

    <FSpace vertical align="start" :size="size">
        <FButton>Text</FButton>
        <FButton>Text</FButton>
        <FButton>Text</FButton>
    </FSpace>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
const sizeType = ref('same');
const sizeHV = ref(20);
const sizeH = ref(30);
const sizeV = ref(10);

const size = computed(() => {
    if (sizeType.value === 'same') {
        return sizeHV.value;
    }
    return [sizeH.value, sizeV.value];
});
</script>
