<template>
    <FForm :labelWidth="160">
        <FFormItem label="大小：">
            <FInputNumber
                v-model="size"
                :min="12"
                :max="30"
                :step="1"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="颜色：">
            <FRadioGroup v-model="color">
                <FRadio value="#5384ff">primary</FRadio>
                <FRadio value="#00cb91">success</FRadio>
                <FRadio value="#ff4d4f">danger</FRadio>
                <FRadio value="#f29360">warning</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="旋转：">
            <FInputNumber
                v-model="rotate"
                :min="0"
                :max="360"
                :step="10"
            ></FInputNumber>
            <span style="margin-left: 10px">deg</span>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <EditOutlined :size="size" :rotate="rotate" :color="color" />
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';
import { EditOutlined } from '@fesjs/fes-design/icon';
const size = ref(24);
const rotate = ref(45);
const color = ref('#5384ff');
</script>
