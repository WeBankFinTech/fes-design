<template>
    <FForm>
        <FFormItem label="点击阴影是否关闭:">
            <FRadioGroup
                v-model="maskClosable"
                :cancelable="false"
                :options="[
                    { label: '是', value: true },
                    { label: '否(默认)', value: false },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace>
        <FButton @click="() => showFModal()">confirm</FButton>
    </FSpace>
</template>

<script setup>
import { FModal } from '@fesjs/fes-design';
import { ref } from 'vue';

const maskClosable = ref(false);

function showFModal() {
    FModal.confirm({
        title: '确认对话',
        content: `这是一个确认对话的弹框`,
        okText: '知道了',
        maskClosable: maskClosable.value,
        onOk() {
            console.log('[modal.confirm] [showFModal] [onOk]');
        },
        onCancel() {
            console.log('[modal.confirm] [showFModal] [onCancel]');
        },
    });
}
</script>
