<template>
    <FSpace>
        <FButton @click="() => showFModalSubmit()">命令行调用</FButton>
        <FButton @click="() => (customShow = true)">自定义页脚</FButton>
    </FSpace>

    <FModal
        v-model:show="customShow"
        title="这里是标题"
        @ok="() => (customShow = false)"
    >
        您的订单还未支付完成，退出将放弃购买
        <template #footer>
            <FSpace justify="end">
                <FButton
                    type="warning"
                    :loading="customCancelLoading"
                    @click="handleCustomCancel"
                >
                    {{ customCancelText }}
                </FButton>
                <FButton
                    type="success"
                    :loading="customOkLoading"
                    @click="handleCustomOk"
                >
                    {{ customOkText }}
                </FButton>
            </FSpace>
        </template>
    </FModal>
</template>

<script>
import { ref } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { FModal } from '@fesjs/fes-design';

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function useCustomFooter() {
    const customShow = ref(false);
    const customOkLoading = ref(false);
    const customCancelLoading = ref(false);
    const customOkText = ref('提交更新');
    const customCancelText = ref('数据还原');

    const handleCustomCancel = async () => {
        customCancelLoading.value = true;
        customCancelText.value = '3s后自动关闭';
        await sleep(2000);
        customCancelLoading.value = false;
        customShow.value = false;
    };
    const handleCustomOk = async () => {
        customOkLoading.value = true;
        customOkText.value = '2s后自动关闭';
        await sleep(3000);
        customOkLoading.value = false;
        customShow.value = false;
    };

    return {
        customShow,
        customOkLoading,
        customCancelLoading,
        handleCustomCancel,
        handleCustomOk,
        customOkText,
        customCancelText,
    };
}

export default {
    setup() {
        function showFModalSubmit() {
            const modal = FModal.confirm({
                title: '确认对话',
                content: `这是一个确认对话的弹框`,
                okText: '提交更新',
                cancelText: '数据还原',
                onOk() {
                    console.log('[modal.confirm] [showFModalSubmit] [onOk]');
                    return new Promise(() => {
                        modal.update({ okText: '2s后自动关闭' });
                        setTimeout(() => {
                            modal.destroy();
                        }, 2000);
                    });
                },
                async onCancel() {
                    console.log(
                        '[modal.confirm] [showFModalSubmit] [onCancel]',
                    );
                    modal.update({ cancelText: '3s后自动关闭' });
                    await sleep(3000);
                    modal.destroy();
                },
            });
        }

        const {
            customShow,
            customCancelLoading,
            customOkLoading,
            handleCustomCancel,
            handleCustomOk,
            customOkText,
            customCancelText,
        } = useCustomFooter();

        return {
            showFModalSubmit,
            customShow,
            customCancelLoading,
            customOkLoading,
            handleCustomCancel,
            handleCustomOk,
            customOkText,
            customCancelText,
        };
    },
};
</script>
