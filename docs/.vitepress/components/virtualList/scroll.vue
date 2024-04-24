<template>
    <FForm :labelWidth="180">
        <FFormItem label="触发 toTop 事件阈值：">
            <FInputNumber
                v-model="topThreshold"
                :min="0"
                :max="50"
                :step="10"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="触发 toBottom 事件阈值：">
            <FInputNumber
                v-model="bottomThreshold"
                :min="0"
                :max="50"
                :step="10"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="是否原生滚动条：">
            <FRadioGroup v-model="native">
                <FRadio :value="true">是</FRadio>
                <FRadio :value="false">否(默认)</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FSpace>
            <FButton @click="handleReset">重置状态</FButton>
            <FButton @click="handleScrollToBottom">滚动到底部位置</FButton>
            <FButton @click="handleScrollToIndex">滚动到指定索引</FButton>
            <FButton @click="handleScrollToOffset">
                滚动到相对指定偏移量
            </FButton>
        </FSpace>
    </FForm>

    <FDivider />

    <FVirtualList
        ref="virtualList"
        class="virtual-scroll-list-scroll"
        wrapClass="virtual-scroll-list-wrap"
        dataKey="id"
        :dataSources="dataItems"
        :estimateSize="100"
        :height="200"
        :topThreshold="topThreshold"
        :bottomThreshold="bottomThreshold"
        :always="true"
        :native="native"
        @scroll="handleScroll"
        @toTop="handleToTop"
        @toBottom="handleToBottom"
        @resized="handleResized"
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

    <FDivider />

    <FSpace vertical>
        <span>第50项高度: {{ getSize }}</span>
        <span>渲染项总数: {{ getSizes }}</span>
        <span>当前滚动偏移量: {{ getOffset }}</span>
        <span>容器高度: {{ getClientSize }}</span>
        <span>滚动高度: {{ getScrollSize }}</span>
    </FSpace>
</template>

<script>
import { ref } from 'vue';
import { debounce } from 'lodash-es';

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
    setup() {
        const virtualList = ref(null);
        const topThreshold = ref(20);
        const bottomThreshold = ref(20);
        const native = ref(false);

        const getSize = ref();
        const getSizes = ref();
        const getOffset = ref();
        const getClientSize = ref();
        const getScrollSize = ref();

        const dataItems = useDataItems();

        function updateSize() {
            getSize.value = virtualList.value.getSize(dataItems.value[49].id);
            getSizes.value = virtualList.value.getSizes();
            getOffset.value = virtualList.value.getOffset();
            getClientSize.value = virtualList.value.getClientSize();
            getScrollSize.value = virtualList.value.getScrollSize();
        }

        const handleScroll = debounce(() => {
            // console.log('[virtualList.scroll] [scroll]');
            updateSize();
        }, 100);
        const handleToTop = () => {
            console.log('[virtualList.scroll] [toTop]');
        };
        const handleToBottom = () => {
            console.log('[virtualList.scroll] [toBottom]');
        };
        const handleResized = debounce((id, size) => {
            console.log(
                '[virtualList.scroll] [resized] id:',
                id,
                ' size:',
                size,
            );
            updateSize();
        }, 100);

        const handleReset = () => {
            virtualList.value.reset();
        };
        const handleScrollToBottom = () => {
            virtualList.value.scrollToBottom();
        };
        const handleScrollToIndex = () => {
            virtualList.value.scrollToIndex(50);
        };
        const handleScrollToOffset = () => {
            virtualList.value.scrollToOffset(-50);
        };

        return {
            virtualList,
            topThreshold,
            bottomThreshold,
            native,
            dataItems,
            handleScroll,
            handleToTop,
            handleToBottom,
            handleResized,

            handleReset,
            handleScrollToBottom,
            handleScrollToIndex,
            handleScrollToOffset,

            getSize,
            getSizes,
            getOffset,
            getClientSize,
            getScrollSize,
        };
    },
};
</script>

<style>
.virtual-scroll-list-scroll .virtual-scroll-list-wrap {
    width: 1000px;
}
.virtual-scroll-list-scroll .item-inner .head {
    font-weight: 500;
}
.virtual-scroll-list-scroll .item-inner .head span:first-child {
    margin-right: 1em;
}
.virtual-scroll-list-scroll .item-inner .desc {
    margin-top: 0.5em;
    margin-bottom: 1em;
    text-align: justify;
}
</style>
