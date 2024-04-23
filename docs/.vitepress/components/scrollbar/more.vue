<template>
    <FForm :labelWidth="160">
        <FFormItem label="总是显示滚动条：">
            <FRadioGroup v-model="always">
                <FRadio :value="false">否(默认)</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="显示待滚动区域阴影：">
            <FRadioGroup v-model="shadow">
                <FRadio :value="false">否(默认)</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="滚动条滑块最小尺寸：">
            <FInputNumber
                v-model="minSize"
                :min="5"
                :max="50"
                :step="10"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FSpace>
            <FButton @click="handleReset">滚动到初始位置</FButton>
            <FButton @click="handleScrollToEnd">滚动到底部位置</FButton>
        </FSpace>
    </FForm>

    <FDivider />

    <FSpace vertical>
        <FScrollbar
            ref="scrollbarRef"
            :height="200"
            :always="always"
            :shadow="shadow"
            style="width: 100%"
            :minSize="minSize"
        >
            <div class="scroll-list">
                <div
                    v-for="(item, index) in vals"
                    :key="index"
                    class="scroll-item"
                >
                    {{ item }}
                </div>
            </div>
        </FScrollbar>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const scrollbarRef = ref(null);
        const always = ref(true);
        const shadow = ref(true);
        const minSize = ref(10);

        const vals = ref([]);
        for (let i = 0; i < 100; ++i) {
            vals.value.push(i);
        }

        const handleReset = () => {
            scrollbarRef.value?.setScrollTop(0, 300);
            scrollbarRef.value?.setScrollLeft(0, 300);
        };

        const handleScrollToEnd = () => {
            scrollbarRef.value?.scrollToEnd(undefined, 500);
        };

        return {
            scrollbarRef,
            vals,
            always,
            minSize,
            shadow,
            handleReset,
            handleScrollToEnd,
        };
    },
};
</script>

<style scoped>
.scroll-list {
    margin: 0;
    padding: 0;
    width: 1000px;
}
.scroll-list > .scroll-item {
    height: 36px;
    background: rgba(83, 132, 255, 0.06);
    border-bottom: 2px solid #fff;
}
.scroll-list > .scroll-item + .scroll-item {
    margin-top: 8px;
}
</style>
