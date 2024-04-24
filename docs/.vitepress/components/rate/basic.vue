<template>
    <FForm :labelWidth="100">
        <FFormItem label="手动更改value:">
            <FInputNumber v-model="value" :max="count" :min="0" />
        </FFormItem>
        <FFormItem label="个数:">
            <FInputNumber v-model="count" :min="3" :max="10" />
        </FFormItem>
        <FFormItem label="颜色填充:">
            <FRadioGroup
                v-model="colorFilled"
                :options="[
                    { label: '否', value: false },
                    { label: '是(默认)', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="可清除:">
            <FRadioGroup
                v-model="clearable"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="半星模式:">
            <FRadioGroup
                v-model="allowHalf"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
        <FFormItem label="只读模式:">
            <FRadioGroup
                v-model="readonly"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>
    <FSpace>
        <FRate
            v-model="value"
            :count="count"
            :color-filled="colorFilled"
            :clearable="clearable"
            :allow-half="allowHalf"
            :readonly="readonly"
        />
    </FSpace>

    <FSpace>
        <span>value值：{{ value }}</span>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(3);
const count = ref(5);
const colorFilled = ref(true);
const clearable = ref(false);
const allowHalf = ref(false);
const readonly = ref(false);
</script>
