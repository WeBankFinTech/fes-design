<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="背景色:">
                <FInput v-model="backgroundColor"></FInput>
            </FFormItem>
            <FFormItem label="字体色:">
                <FInput v-model="color"></FInput>
            </FFormItem>
            <FFormItem label="内容:">
                <FInput v-model="text"></FInput>
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FAvatar :size="32" :color="color" :backgroundColor="backgroundColor">
            {{ text }}
        </FAvatar>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const color = ref('#fff');
const backgroundColor = ref('#ff4d4f');
const text = ref('M');
</script>
