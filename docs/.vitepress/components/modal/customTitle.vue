<template>
    <FSpace>
        <FButton @click="show = true">自定义头部</FButton>
        <FModal v-model:show="show" title="这里是标题" @ok="show = false">
            <template #title>
                <div class="header">
                    <span style="margin-right: 8px">自定义头部标题</span>
                    <EditOutlined />
                </div>
            </template>
            您的订单还未支付完成，退出将放弃购买
        </FModal>
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
