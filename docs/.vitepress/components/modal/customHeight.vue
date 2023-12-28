<template>
    <FSpace>
        <FForm :labelWidth="120">
            <FFormItem label="弹窗内容高度类型">
                <FRadioGroup
                    v-model="customHeight"
                    :options="[
                        { label: '自适应（默认）', value: false },
                        { label: '自定义高度', value: true },
                    ]"
                />
            </FFormItem>
            <FFormItem label="设置最大内容高度">
                <FRadioGroup
                    v-model="setMaxHeight"
                    :options="[
                        { label: '不设置（默认）', value: false },
                        { label: '设置', value: true },
                    ]"
                />
            </FFormItem>
            <FFormItem v-if="customHeight" label="自定义高度类型">
                <FRadioGroup
                    v-model="customHeightType"
                    :options="[
                        { label: '百分比', value: 1 },
                        { label: '固定高度', value: 2 },
                    ]"
                />
            </FFormItem>
            <FFormItem
                v-if="customHeightType === 1 && customHeight"
                label="屏幕百分比高度"
            >
                <FInputNumber
                    v-model="percent"
                    :min="10"
                    :max="100"
                    :step="10"
                ></FInputNumber>
                <span style="margin-left: 10px">vh</span>
            </FFormItem>
            <FFormItem
                v-if="customHeightType === 2 && customHeight"
                label="固定高度"
            >
                <FInputNumber
                    v-model="height"
                    :min="100"
                    :max="400"
                    :step="10"
                ></FInputNumber>
                <span style="margin-left: 10px">px</span>
            </FFormItem>
            <FFormItem v-if="setMaxHeight" label="最大内容高度">
                <FInputNumber
                    v-model="maxHeight"
                    :max="800"
                    :step="100"
                ></FInputNumber>
                <span style="margin-left: 10px">px</span>
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FButton @click="show = true">打开弹窗</FButton>
        <FModal
            v-model:show="show"
            title="弹窗标题"
            :maxHeight="setMaxHeight ? maxHeight : undefined"
            :height="
                customHeight
                    ? customHeightType === 1
                        ? `${percent}vh`
                        : height
                    : 'auto'
            "
            @ok="show = false"
        >
            <div v-for="n in 30" :key="n">我是内容...</div>
        </FModal>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const show = ref(false);
        const setMaxHeight = ref(false);
        const percent = ref(20);
        // 固定高度
        const height = ref(200);
        const maxHeight = ref(300);
        const customHeight = ref(false);
        const customHeightType = ref(1);

        return {
            show,
            setMaxHeight,
            percent,
            height,
            maxHeight,
            customHeight,
            customHeightType,
        };
    },
};
</script>
