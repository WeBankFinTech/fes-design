<template>
    <FSpace>
        <FButton @click="show[0] = true">常规</FButton>
        <FFloatingPane v-model:visible="show[0]" title="常规" displayDirective="show" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
            <div style="padding: 8px">
                <div>我是内容...</div>
                <div>我是内容...</div>
                <div>我是内容...</div>
            </div>
        </FFloatingPane>
    </FSpace>
</template>

<script>
import { reactive } from 'vue';

export default {
    setup() {
        const show = reactive([]);

        const handleAfterEnter = (e) => {
            console.log('[floatingPane.common] handleAfterEnter, e:', e);
        };
        const handleAfterLeave = (e) => {
            console.log('[floatingPane.common] handleAfterLeave, e:', e);
        };

        return {
            show,
            handleAfterEnter,
            handleAfterLeave,
        };
    },
};
</script>
