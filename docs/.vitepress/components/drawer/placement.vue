<template>
    <FSpace>
        <FRadioGroup v-model="placement">
            <FRadio value="top">top</FRadio>
            <FRadio value="bottom">bottom</FRadio>
            <FRadio value="left">left</FRadio>
            <FRadio value="right">right</FRadio>
        </FRadioGroup>
    </FSpace>
    <FButton style="margin-top: 20px" @click="open">打开抽屉</FButton>
    <FDrawer
        v-model:show="show"
        title="这里是标题"
        :placement="placement"
        @ok="show = false"
    >
        <div>我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
    </FDrawer>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const placement = ref('right');
        const show = ref(false);
        const open = () => {
            show.value = true;
        };
        return {
            placement,
            show,
            open,
        };
    },
};
</script>
