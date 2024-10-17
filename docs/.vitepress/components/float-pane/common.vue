<template>
    <FSpace>
        <FButton @click="show[0] = true">常规</FButton>
        <FButton @click="show[1] = true">自定义位置缓存KEY</FButton>
        <FButton @click="handleResetPosition">清除位置缓存</FButton>
    </FSpace>
    <FDivider />
    <FButton @click="show[2] = true">不可拖动</FButton>
    <FDivider />
    <FButton @click="show[3] = true">无位置缓存</FButton>

    <FFloatPane ref="floatPane1Ref" v-model:visible="show[0]" title="常规" displayDirective="show" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
        <div style="padding: 8px">
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </div>
    </FFloatPane>
    <FFloatPane ref="floatPane2Ref" v-model:visible="show[1]" :zIndex="0" title="自定义缓存KEY" cachePositionKey="float-pane-custom" displayDirective="show" @afterEnter="handleAfterEnter" @afterLeave="handleAfterLeave">
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

<script setup>
import { reactive, ref } from 'vue';

const show = reactive([]);

const floatPane1Ref = ref(null);
const floatPane2Ref = ref(null);

const handleAfterEnter = (e) => {
    console.log('[floatPane.common] handleAfterEnter, e:', e);
};
const handleAfterLeave = (e) => {
    console.log('[floatPane.common] handleAfterLeave, e:', e);
};

const handleResetPosition = () => {
    floatPane1Ref.value?.resetPosition();
    floatPane2Ref.value?.resetPosition();
};
</script>
