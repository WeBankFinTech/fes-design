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
    </FForm>

    <FDivider></FDivider>

    <FSpace vertical>
        <FVirtualList
            ref="virtualList"
            class="virtual-scroll-list"
            wrapClass="virtual-scroll-list-wrap"
            :dataKey="(data) => data"
            :dataSources="vals"
            :estimateSize="80"
            :height="200"
            :topThreshold="topThreshold"
            :bottomThreshold="bottomThreshold"
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
    </FSpace>
</template>

<script>
import { ref } from 'vue';
import { debounce } from 'lodash-es';
export default {
    setup() {
        const topThreshold = ref(20);
        const bottomThreshold = ref(20);

        const vals = ref([]);
        for (let i = 0; i < 6; ++i) {
            vals.value.push(i);
        }

        const handleScroll = debounce(() => {
            console.log('[virtualList.scroll] [scroll]');
        }, 100);
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
        };

        return {
            topThreshold,
            bottomThreshold,
            vals,
            handleScroll,
            handleToTop,
            handleToBottom,
            handleResized,
        };
    },
};
</script>

<style>
.virtual-scroll-list .virtual-scroll-list-wrap {
    margin: 0;
    padding: 0;
    width: 1000px;
}
.virtual-scroll-list .virtual-scroll-list-wrap .virtual-scroll-item {
    height: 36px;
    background: rgba(83, 132, 255, 0.06);
    border-bottom: 2px solid #fff;
}
.virtual-scroll-list
    .virtual-scroll-list-wrap
    .virtual-scroll-item
    + .virtual-scroll-item {
    margin-top: 8px;
}
</style>
