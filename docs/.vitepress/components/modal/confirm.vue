<template>
    <FSpace>
        <FButton @click="showFModal('confirm')">confirm</FButton>
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
                    console.log('[modal.confirm] [showFModal] [onOk]');
                    if (type === 'confirm') {
                        return new Promise(() => {
                            modal.update({ okText: '2s后自动关闭' });
                            setTimeout(() => {
                                modal.destroy();
                            }, 2000);
                        });
                    } else {
                        return Promise.resolve();
                    }
                },
                onCancel() {
                    console.log('[modal.confirm] [showFModal] [onCancel]');
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
