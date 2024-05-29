<template>
    <FSpace>
        <FButton @click="show[0] = true">常规</FButton>
        <FButton @click="show[1] = true">不可拖动</FButton>
        <FFloatPane v-model:visible="show[0]" title="常规" displayDirective="show" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
            <div style="padding: 8px">
                <div>我是内容...</div>
                <div>我是内容...</div>
                <div>我是内容...</div>
            </div>
        </FFloatPane>
        <FFloatPane v-model:visible="show[1]" title="不可拖动" :draggable="false" cachePosition="" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
            <div style="padding: 8px">
                <div>我是内容...</div>
                <div>我是内容...</div>
                <div>我是内容...</div>
            </div>
        </FFloatPane>
    </FSpace>
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
