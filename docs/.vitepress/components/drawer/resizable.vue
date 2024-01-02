<template>
    <FForm>
        <FFormItem label="位置:">
            <FRadioGroup v-model="placement">
                <FRadio value="top">top</FRadio>
                <FRadio value="bottom">bottom</FRadio>
                <FRadio value="left">left</FRadio>
                <FRadio value="right">right</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="最大尺寸:">
            <FInputNumber v-model="max"></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="最小尺寸:">
            <FInputNumber v-model="min"></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FButton @click="open">打开抽屉</FButton>
    <FDrawer
        v-model:show="show"
        title="这里是标题"
        width="600px"
        :placement="placement"
        resizable
        :resizeMax="max"
        :resizeMin="min"
        @ok="show = false"
    >
        <div>我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
    </FDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
const placement = ref('right');
const max = ref();
const min = ref();

const open = () => {
    show.value = true;
};
</script>
