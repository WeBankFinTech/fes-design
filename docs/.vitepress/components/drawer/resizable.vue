<template>
    <FButton @click="open">打开抽屉</FButton>
    <FDrawer
        v-model:show="show"
        title="这里是标题"
        resizable
        placement="right"
        width="600px"
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
        const show = ref(false);

        const open = () => {
            show.value = true;
        };
        return {
            show,
            open,
        };
    },
};
</script>
