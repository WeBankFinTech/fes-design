<template>
    <FSpace>
        <FButton @click="() => showFModal()">confirm</FButton>
    </FSpace>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import { FModal } from '@fesjs/fes-design';

export default {
    setup() {
        function showFModal() {
            FModal.confirm({
                title: '确认对话',
                content: `这是一个确认对话的弹框`,
                okText: '知道了',
                onOk() {
                    console.log('[modal.confirm] [showFModal] [onOk]');
                },
                onCancel() {
                    console.log('[modal.confirm] [showFModal] [onCancel]');
                },
            });
        }
        return {
            showFModal,
        };
    },
};
</script>
