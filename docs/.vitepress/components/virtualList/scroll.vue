<template>
    <FForm :labelWidth="180">
        <FFormItem label="触发 totop 事件阈值：">
            <FInputNumber
                v-model="topThreshold"
                :min="0"
                :max="50"
                :step="10"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="触发 tobottom 事件阈值：">
            <FInputNumber
                v-model="bottomThreshold"
                :min="0"
                :max="50"
                :step="10"
            ></FInputNumber>
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
            <FButton @click="handleScrollToIndex">滚动到相对指定索引</FButton>
            <FButton @click="handleScrollToOffset">
                滚动到相对指定偏移量
            </FButton>
        </FSpace>
    </FForm>

    <FDivider></FDivider>

    <FSpace vertical>
        <FVirtualList
            ref="virtualList"
            class="virtual-scroll-list-scroll"
            wrapClass="virtual-scroll-list-wrap"
            :dataKey="(data) => data"
            :dataSources="vals"
            :estimateSize="36"
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
                <div class="virtual-scroll-item">
                    {{ source }}
                </div>
            </template>
        </FVirtualList>

        <FSpace vertical>
            <span>第10项尺寸: {{ getSize }}</span>
            <span>渲染项总数: {{ getSizes }}</span>
            <span>当前滚动偏移量: {{ getOffset }}</span>
            <span>容器高度: {{ getClientSize }}</span>
            <span>滚动高度: {{ getScrollSize }}</span>
        </FSpace>
    </FSpace>
</template>

<script>
import { ref } from 'vue';
import { debounce } from 'lodash-es';
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

        const vals = ref([]);
        for (let i = 0; i < 100; ++i) {
            vals.value.push(i);
        }

        function updateSize() {
            getSize.value = virtualList.value.getSize(10);
            getSizes.value = virtualList.value.getSizes();
            getOffset.value = virtualList.value.getOffset();
            getClientSize.value = virtualList.value.getClientSize();
            getScrollSize.value = virtualList.value.getScrollSize();
        }

        const handleScroll = debounce(() => {
            // console.log('[virtualList.scroll] [scroll]');
            updateSize();
        }, 10);
        const handleToTop = () => {
            console.log('[virtualList.scroll] [toTop]');
        };
        const handleToBottom = () => {
            console.log('[virtualList.scroll] [toBottom]');
        };
        const handleResized = (id, size) => {
            console.log(
                '[virtualList.scroll] [resized] id:',
                id,
                ' size:',
                size,
            );
            updateSize();
        };

        const handleReset = () => {
            virtualList.value.reset();
        };
        const handleScrollToBottom = () => {
            virtualList.value.scrollToBottom();
        };
        const handleScrollToIndex = () => {
            virtualList.value.scrollToIndex(10);
        };
        const handleScrollToOffset = () => {
            virtualList.value.scrollToOffset(10);
        };

        return {
            virtualList,
            topThreshold,
            bottomThreshold,
            native,
            vals,
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
    margin: 0;
    padding: 0;
    width: 1000px;
}
.virtual-scroll-list-scroll .virtual-scroll-list-wrap .virtual-scroll-item {
    height: 36px;
    box-sizing: border-box;
    background: rgba(83, 132, 255, 0.06);
    border-bottom: 2px solid #fff;
}
</style>
