<template>
    <FForm :labelWidth="200">
        <FFormItem label="virtualScroll 类型：">
            <FRadioGroup v-model="propType" :cancelable="false">
                <FRadio value="boolean">boolean(默认)</FRadio>
                <FRadio value="number">number</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-if="propType === 'number'" label="达到数量开启虚拟滚动：">
            <FInputNumber v-model="virtualScroll" :min="0" :max="50000" />
        </FFormItem>
        <FFormItem v-if="propType === 'boolean'" label="开启虚拟滚动：">
            <FRadioGroup v-model="virtualScroll" :cancelable="false">
                <FRadio :value="true">true(默认)</FRadio>
                <FRadio :value="false">false</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider />

    <FSelect
        :virtualScroll="virtualScroll"
        :options="options"
        style="width: 200px"
        valueField="key"
        labelField="name"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const options = computed(() =>
    new Array(1000)
        .fill(null)
        .map((_, index) => ({ name: index + 1, key: index + 1 })),
);

const propType = ref<'boolean' | 'number'>('boolean');
const virtualScroll = ref<boolean | number>(true);

watch(propType, (nextType) => {
    if (nextType === 'number') {
        virtualScroll.value = 50;
    } else {
        virtualScroll.value = true;
    }
});
</script>
