<template>
    <FSpace>
        <FButton @click="showFModal('info')">info</FButton>
        <FButton @click="showFModal('success')">success</FButton>
        <FButton @click="showFModal('warning')">warning</FButton>
        <FButton @click="showFModal('error')">error</FButton>
    </FSpace>
</template>

<script>
import { FModal } from '@fesjs/fes-design';

export default {
    setup() {
        const typeMap = {
            info: '普通消息',
            success: '成功消息',
            warning: '警告消息',
            error: '错误消息',
        };
        function showFModal(type) {
            FModal[type]({
                title: typeMap[type],
                content: `这是一个${typeMap[type]}的弹框`,
                okText: '知道了',
                onOk() {
                    console.log(
                        '[modal.feedback] [showFModal] [onOk] type:',
                        type,
                    );
                },
                onCancel() {
                    console.log(
                        '[modal.feedback] [showFModal] [onCancel] type:',
                        type,
                    );
                },
            });
        }
        return {
            showFModal,
        };
    },
};
</script>
