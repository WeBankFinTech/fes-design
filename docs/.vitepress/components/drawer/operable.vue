<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="蒙层开关:">
                <FSwitch v-model="mask"></FSwitch>
            </FFormItem>
            <FFormItem label="可交互开关:">
                <FSwitch v-model="operable"></FSwitch>
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FButton @click="show = true">打开抽屉</FButton>
    </FSpace>
    <FDrawer
        v-model:show="show"
        title="抽屉组件"
        :mask="mask"
        :operable="operable"
        @ok="show = false"
    >
        <div>我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
    </FDrawer>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(false);
const mask = ref(false);
const operable = ref(true);
</script>
