<template>
    <FForm>
        <FFormItem label="是否展示取消按钮:">
            <FRadioGroup
                v-model="showCancel"
                :options="[
                    { label: '是(默认)', value: true },
                    { label: '否', value: false },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <FButton @click="() => (normalShow = true)">常规</FButton>
        <FButton @click="() => (customShow = true)">自定义页脚</FButton>
    </FSpace>

    <FDrawer
        v-model:show="normalShow"
        title="常规"
        displayDirective="if"
        :footer="true"
        :okLoading="normalOkLoading"
        :okText="normalOkText"
        :showCancel="showCancel"
        @ok="() => handleNormalOk()"
        @cancel="normalShow = false"
    >
        <div style="height: 1000px">我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
    </FDrawer>

    <FDrawer
        v-model:show="customShow"
        displayDirective="if"
        :footer="true"
        title="自定义页脚"
    >
        <div style="height: 1000px">我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
        <template #footer>
            <FSpace justify="end">
                <FButton
                    v-show="showCancel"
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
    </FDrawer>
</template>

<script>
import { ref, nextTick } from 'vue';

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function useDrawer() {
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
        const showCancel = ref(true);

        const {
            show: normalShow,
            okLoading: normalOkLoading,
            handleOk: handleNormalOk,
            okText: normalOkText,
        } = useDrawer();

        const {
            show: customShow,
            cancelLoading: customCancelLoading,
            okLoading: customOkLoading,
            handleCancel: handleCustomCancel,
            handleOk: handleCustomOk,
            okText: customOkText,
            cancelText: customCancelText,
        } = useDrawer();

        return {
            normalShow,
            normalOkLoading,
            handleNormalOk,
            normalOkText,
            showCancel,

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
