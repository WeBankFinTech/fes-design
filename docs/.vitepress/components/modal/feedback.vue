<template>
    <FSpace>
        <FButton @click="showFModal('info')">info</FButton>
        <FButton class="ml-10" @click="showFModal('success')">success</FButton>
        <FButton class="ml-10" @click="showFModal('warning')">warning</FButton>
        <FButton class="ml-10" @click="showFModal('error')">error</FButton>
    </FSpace>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import { FModal } from '@fesjs/fes-design';

export default {
    setup() {
        const typeMap = {
            info: '普通消息',
            success: '成功消息',
            warning: '警告消息',
            error: '错误消息',
            confirm: '确认对话',
        };
        function showFModal(type) {
            const modal = FModal[type]({
                title: typeMap[type],
                content: `这是一个${typeMap[type]}的弹框`,
                okText: '知道了',
                // getContainer: () => document.getElementById('modalContainer'),
                onOk() {
                    console.log('[modal.feedback] [showFModal] [onOk]');
                    if (type === 'confirm') {
                        return new Promise(() => {
                            modal.update({ okText: '1s后自动关闭' });
                            setTimeout(() => {
                                modal.destroy();
                            }, 1000);
                        });
                    } else {
                        return Promise.resolve();
                    }
                },
                onCancel() {
                    console.log('[modal.feedback] [showFModal] [onCancel]');
                    return Promise.resolve();
                },
            });
        }
        return {
            showFModal,
        };
    },
};
</script>
