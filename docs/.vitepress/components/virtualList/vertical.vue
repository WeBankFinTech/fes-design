<template>
    <FVirtualList
        ref="virtualList"
        class="virtual-scroll-list-vertical"
        :dataKey="(data) => data.id"
        :dataSources="items"
        :estimateSize="80"
        :height="height"
    >
        <template #default="{ source }">
            <div class="item-inner">
                <div class="head">
                    <span># {{ source.index }}</span>
                    <span>{{ source.name }}</span>
                </div>
                <div class="desc">{{ source.desc }}</div>
            </div>
        </template>
    </FVirtualList>
</template>

<script>
import { ref } from 'vue';

function useDataItems() {
    // The Climb (From Miley Cyrus)
    const sentence3 = [
        'BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。',
        'IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)',
        'margin 重合，margin 塌陷',
        'css3',
        'html5IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)IFC(Inline Formatting Contexts)直译为”内联格式化上下文”，IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)',
        'es6',
    ];

    const TOTAL_COUNT = 1000;

    const genUniqueId = (prefix) => {
        return `${prefix}$${Math.random().toString(16).substr(9)}`;
    };

    const getSentences = () => {
        const index = Math.floor(Math.random() * (sentence3.length - 1));
        return sentence3[index];
    };

    const dataItems = ref([]);
    let count = TOTAL_COUNT;
    while (count--) {
        const index = TOTAL_COUNT - count;
        dataItems.value.push({
            index,
            name: `${Math.random()}`,
            id: genUniqueId(index),
            desc: getSentences(),
        });
    }

    return dataItems;
}

export default {
    name: 'Vertical',
    setup() {
        const virtualList = ref(null);
        const height = ref(200);

        const dataItems = useDataItems();

        return {
            virtualList,
            items: dataItems,
            height,
        };
    },
};
</script>

<style scoped>
.virtual-scroll-list-vertical .item-inner .head {
    font-weight: 500;
}
.virtual-scroll-list-vertical .item-inner .head span:first-child {
    margin-right: 1em;
}
.virtual-scroll-list-vertical .item-inner .desc {
    margin-top: 0.5em;
    margin-bottom: 1em;
    text-align: justify;
}
</style>
