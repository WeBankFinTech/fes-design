<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="点击蒙层关闭:">
                <FRadioGroup
                    v-model="maskClosable"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
            <FFormItem label="esc关闭:">
                <FRadioGroup
                    v-model="escClosable"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FButton @click="show = true">打开抽屉</FButton>
        <FDrawer
            v-model:show="show"
            title="抽屉"
            :maskClosable="maskClosable"
            :escClosable="escClosable"
            @ok="show = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FDrawer>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const show = ref(false);

const maskClosable = ref(true);

const escClosable = ref(true);
</script>
