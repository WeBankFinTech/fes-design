<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="进度条类型:">
                <FRadioGroup
                    v-model="type"
                    :options="[
                        { label: '水平进度条(默认)', value: 'line' },
                        { label: '环形进度条', value: 'circle' },
                    ]"
                />
            </FFormItem>
            <FFormItem label="百分比:">
                <FInputNumber
                    v-model="percent"
                    :min="0"
                    :max="100"
                    :step="10"
                />
                <span class="unit">%</span>
            </FFormItem>
            <FFormItem v-if="type === 'line'" label="高度:">
                <FInputNumber
                    v-model="height"
                    :min="8"
                    :max="50"
                />
                <span class="unit">px</span>
            </FFormItem>
            <FFormItem v-if="type === 'circle'" label="宽度:">
                <FInputNumber v-model="width" :min="8" :max="50" />
                <span class="unit">px</span>
            </FFormItem>
            <FFormItem v-if="type === 'circle'" label="环形直径:">
                <FInputNumber v-model="circleSize" />
                <span class="unit">px</span>
            </FFormItem>
            <FFormItem v-if="type === 'line'" label="百分比外显:">
                <FRadioGroup
                    v-model="showOutPercent"
                    :options="[
                        { label: '否(默认)', value: false },
                        { label: '是', value: true },
                    ]"
                />
            </FFormItem>
            <FFormItem v-if="type === 'line'" label="百分比内显:">
                <FRadioGroup
                    v-model="showInnerPercent"
                    :options="[
                        { label: '否(默认)', value: false },
                        { label: '是', value: true },
                    ]"
                    :disabled="height < 12"
                />
            </FFormItem>
            <FFormItem v-if="type === 'circle'" label="显示文案:">
                <FRadioGroup
                    v-model="showCircleText"
                    :options="[
                        { label: '否(默认)', value: false },
                        { label: '是', value: true },
                    ]"
                />
            </FFormItem>
            <FFormItem label="颜色:">
                <FInput placeholder="请输入颜色或者色号" @change="change" />
            </FFormItem>
        </FForm>
    </FSpace>
    <FDivider />
    <FProgress
        :type="type"
        :percent="percent"
        :showOutPercent="showOutPercent"
        :showInnerPercent="showInnerPercent"
        :height="height"
        :width="width"
        :color="color"
        :circleSize="circleSize"
        :showCircleText="showCircleText"
    />
</template>

<script setup>
import { ref } from 'vue';

const type = ref('line');

const percent = ref(60);

const height = ref(8);

const width = ref(8);

const showOutPercent = ref(false);

const showInnerPercent = ref(false);

const color = ref();

const circleSize = ref(160);

const showCircleText = ref(false);

const change = (val) => {
    color.value = val;
};
</script>

<style>
.unit {
    margin-left: 8px;
}
</style>
