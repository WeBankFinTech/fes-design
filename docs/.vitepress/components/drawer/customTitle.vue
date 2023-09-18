<template>
    <FSpace>
        <FButton @click="show = true">自定义头部</FButton>
        <FDrawer v-model:show="show" title="这里是标题" @ok="show = false">
            <template #title>
                <div class="header">
                    <span style="margin-right: 8px">自定义头部标题</span>
                    <EditOutlined />
                </div>
            </template>
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FDrawer>
    </FSpace>
</template>

<script>
import { ref } from 'vue';
import { EditOutlined } from '@fesjs/fes-design/icon';

export default {
    components: {
        EditOutlined,
    },
    setup() {
        const show = ref(false);
        return {
            show,
        };
    },
};
</script>

<style scoped>
.header {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
