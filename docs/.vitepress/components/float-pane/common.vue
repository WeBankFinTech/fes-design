<template>
    <FSpace>
        <FButton @click="show[0] = true">常规</FButton>
        <FButton @click="show[1] = true">自定义缓存KEY</FButton>
    </FSpace>
    <FDivider />
    <FButton @click="show[2] = true">不可拖动</FButton>
    <FDivider />
    <FButton @click="show[3] = true">无位置缓存</FButton>

    <FFloatPane v-model:visible="show[0]" title="常规" displayDirective="show" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
        <div style="padding: 8px">
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </div>
    </FFloatPane>
    <FFloatPane v-model:visible="show[1]" title="自定义缓存KEY" cachePositionKey="float-pane-custom" displayDirective="show" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
        <div style="padding: 8px">
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </div>
    </FFloatPane>
    <FFloatPane v-model:visible="show[2]" title="不可拖动" :draggable="false" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
        <div style="padding: 8px">
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </div>
    </FFloatPane>
    <FFloatPane v-model:visible="show[3]" title="无位置缓存" cachePosition="" displayDirective="if" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
        <div style="padding: 8px">
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </div>
    </FFloatPane>
</template>

<script>
import { reactive } from 'vue';

export default {
    setup() {
        const show = reactive([]);

        const handleAfterEnter = (e) => {
            console.log('[floatPane.common] handleAfterEnter, e:', e);
        };
        const handleAfterLeave = (e) => {
            console.log('[floatPane.common] handleAfterLeave, e:', e);
        };

        return {
            show,
            handleAfterEnter,
            handleAfterLeave,
        };
    },
};
</script>
