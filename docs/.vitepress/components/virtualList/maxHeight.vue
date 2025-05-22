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
        <FVirtualList
            class="virtual-scroll-list-max-height"
            wrapClass="virtual-scroll-list-wrap"
            dataKey="id"
            :dataSources="vals"
            :estimateSize="80"
            :height="height"
            :maxHeight="maxHeight"
        >
            <template #default="{ source }">
                <div class="virtual-scroll-item">
                    {{ source.desc }}
                </div>
            </template>
        </FVirtualList>
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
        const sentence3 = [
            'BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。',
            'IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)',
            'margin 重合，margin 塌陷',
            'html5IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)',
        ];
        const genUniqueId = (prefix) => {
            return `${prefix}$${Math.random().toString(16).substr(9)}`;
        };
        const getSentences = () => {
            const index = Math.floor(Math.random() * (sentence3.length - 1));
            return sentence3[index];
        };

        const createData = (length, startIndex, isAdd = true) => {
            const result = [];
            let count = length;
            while (count--) {
                const index = isAdd ? startIndex + length - count - 1 : startIndex - count - 1;
                result.push({
                    index,
                    name: `${Math.random()}`,
                    id: genUniqueId(index),
                    desc: getSentences(),
                });
            }
            return result;
        };

        vals.value = createData(1000, 1);

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

<style>
.virtual-scroll-list-max-height .virtual-scroll-list-wrap {
    margin: 0;
    padding: 0;
    width: 1000px;
}
.virtual-scroll-list-max-height .virtual-scroll-list-wrap .virtual-scroll-item {
    margin: 0.5em;
}
.virtual-scroll-list-max-height
    .virtual-scroll-list-wrap
    .virtual-scroll-item
    + .virtual-scroll-item {
    margin-top: 8px;
}
</style>
