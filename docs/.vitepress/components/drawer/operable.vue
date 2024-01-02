<template>
    <FSpace>
        <FForm :labelWidth="120">
            <FFormItem label="是否显示蒙层:">
                <FRadioGroup
                    v-model="mask"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
            <FFormItem label="页面是否可交互:">
                <FRadioGroup
                    v-model="operable"
                    :disabled="mask"
                    :options="[
                        { label: '是', value: true },
                        { label: '否(默认)', value: false },
                    ]"
                />
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
import { ref, watch } from 'vue';
const show = ref(false);
const mask = ref(true);
const operable = ref(false);

watch(mask, (nextMask) => {
    if (nextMask) {
        operable.value = false;
    }
});
</script>
