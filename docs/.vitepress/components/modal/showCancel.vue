<template>
    <FForm>
        <FFormItem label="是否展示取消按钮:">
            <FRadioGroup
                v-model="showCancel"
                :options="[
                    { label: '默认', value: undefined },
                    { label: '是', value: true },
                    { label: '否', value: false },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace>
        <FButton @click="showFModalNormal = true">常规</FButton>
        <FButton @click="showFModalNormalConfirm = true">确认对话框</FButton>
        <FButton @click="() => showFModalConfirm()">全局方法 - confirm</FButton>
        <FButton @click="() => showFModalInfo()">全局方法 - info</FButton>
    </FSpace>

    <FModal
        v-model:show="showFModalNormal"
        title="常规"
        displayDirective="if"
        :showCancel="showCancel"
        @ok="showFModalNormal = false"
    >
        <div>我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
    </FModal>
    <FModal
        v-model:show="showFModalNormalConfirm"
        type="confirm"
        title="确认对话框"
        displayDirective="if"
        :showCancel="showCancel"
        @ok="showFModalNormalConfirm = false"
    >
        <div>这是一个确认对话的弹框...</div>
    </FModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FModal } from '@fesjs/fes-design';

const showCancel = ref();
const showFModalNormal = ref(false);
const showFModalNormalConfirm = ref(false);

function showFModalConfirm() {
    FModal.confirm({
        title: '确认对话',
        content: `这是一个确认对话的弹框`,
        okText: '知道了',
        showCancel: showCancel.value,
        onOk() {
            console.log('[modal.showCancel] [showFModalConfirm] [onOk]');
        },
        onCancel() {
            console.log('[modal.showCancel] [showFModalConfirm] [onCancel]');
        },
    });
}
function showFModalInfo() {
    FModal.info({
        title: '普通消息',
        content: `这是一个普通消息的弹框`,
        okText: '知道了',
        showCancel: showCancel.value,
        onOk() {
            console.log('[modal.showCancel] [showFModalInfo] [onOk]');
        },
        onCancel() {
            console.log('[modal.showCancel] [showFModalInfo] [onCancel]');
        },
    });
}
</script>
