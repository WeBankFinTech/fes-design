<template>
    <FForm :labelWidth="160">
        <FFormItem label="高度类型：">
            <FRadioGroup v-model="heightType">
                <FRadio value="height">固定高度</FRadio>
                <FRadio value="maxHeight">最大高度</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-if="heightType === 'height'" label="固定高度：">
            <FInputNumber
                v-model="height"
                :min="100"
                :max="400"
                :step="10"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem v-if="heightType === 'maxHeight'" label="最大高度：">
            <FInputNumber
                v-model="maxHeight"
                :min="100"
                :max="400"
                :step="10"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace vertical>
        <FScrollbar :height="height" :maxHeight="maxHeight" style="width: 100%">
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
import { ref, watch } from 'vue';

export default {
    setup() {
        const heightType = ref('maxHeight');
        const height = ref();
        const maxHeight = ref(200);

        const vals = ref([]);
        for (let i = 0; i < 6; ++i) {
            vals.value.push(i);
        }

        watch(
            heightType,
            () => {
                if (heightType.value === 'height') {
                    height.value = 200;
                    maxHeight.value = undefined;
                } else if (heightType.value === 'maxHeight') {
                    height.value = undefined;
                    maxHeight.value = 200;
                } else {
                    height.value = undefined;
                    maxHeight.value = undefined;
                }
            },
            {
                immediate: true,
            },
        );

        return {
            vals,
            heightType,
            height,
            maxHeight,
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
