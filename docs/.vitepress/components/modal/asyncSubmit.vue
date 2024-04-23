<template>
    <FSpace>
        <FButton @click="() => showFModalSubmit()">全局方法</FButton>
        <FButton @click="() => (normalShow = true)">常规</FButton>
        <FButton @click="() => (customShow = true)">自定义页脚</FButton>
    </FSpace>

    <FModal
        v-model:show="normalShow"
        title="常规"
        displayDirective="if"
        type="confirm"
        :okLoading="normalOkLoading"
        :okText="normalOkText"
        @ok="() => handleNormalOk()"
        @cancel="normalShow = false"
    >
        您的订单还未支付完成，退出将放弃购买
    </FModal>

    <FModal
        v-model:show="customShow"
        displayDirective="if"
        type="confirm"
        title="自定义页脚"
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
                    type="primary"
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
import { ref, nextTick } from 'vue';
import { FModal } from '@fesjs/fes-design';

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function useModal() {
    const show = ref(false);
    const okLoading = ref(false);
    const cancelLoading = ref(false);
    const okText = ref('提交更新');
    const cancelText = ref('数据还原');

    const handleCancel = async () => {
        cancelLoading.value = true;
        cancelText.value = '3s后自动关闭';
        await sleep(3000);
        cancelLoading.value = false;
        show.value = false;
        await nextTick();
        cancelText.value = '数据还原';
    };
    const handleOk = async () => {
        okLoading.value = true;
        okText.value = '2s后自动关闭';
        await sleep(2000);
        okLoading.value = false;
        show.value = false;
        await nextTick();
        okText.value = '提交更新';
    };

    return {
        show,
        okLoading,
        cancelLoading,
        handleCancel,
        handleOk,
        okText,
        cancelText,
    };
}

export default {
    setup() {
        function showFModalSubmit() {
            const modal = FModal.confirm({
                title: '确认对话',
                content: `您的订单还未支付完成，退出将放弃购买`,
                okText: '提交更新',
                cancelText: '数据还原',
                onOk() {
                    console.log(
                        '[modal.asyncSubmit] [showFModalSubmit] [onOk]',
                    );
                    return new Promise(() => {
                        modal.update({
                            okText: '2s后自动关闭',
                            okLoading: true,
                        });
                        setTimeout(() => {
                            modal.destroy();
                        }, 2000);
                    });
                },
                async onCancel() {
                    console.log(
                        '[modal.asyncSubmit] [showFModalSubmit] [onCancel]',
                    );
                    modal.update({
                        cancelText: '3s后自动关闭',
                        cancelLoading: true,
                    });
                    await sleep(3000);
                    modal.destroy();
                },
            });
        }

        const {
            show: normalShow,
            okLoading: normalOkLoading,
            handleOk: handleNormalOk,
            okText: normalOkText,
        } = useModal();

        const {
            show: customShow,
            cancelLoading: customCancelLoading,
            okLoading: customOkLoading,
            handleCancel: handleCustomCancel,
            handleOk: handleCustomOk,
            okText: customOkText,
            cancelText: customCancelText,
        } = useModal();

        return {
            showFModalSubmit,

            normalShow,
            normalOkLoading,
            handleNormalOk,
            normalOkText,

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
