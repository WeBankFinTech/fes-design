<template>
    <FSpace>
        <FButton @click="show = true">自定义页脚</FButton>
        <FDrawer v-model:show="show" title="这里是标题" :footer="true">
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
            <template #footer>
                <FSpace justify="end">
                    <FButton>取消</FButton>
                    <FButton type="primary">确认</FButton>
                </FSpace>
            </template>
        </FDrawer>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const show = ref(false);
        return {
            show,
        };
    },
};
</script>
