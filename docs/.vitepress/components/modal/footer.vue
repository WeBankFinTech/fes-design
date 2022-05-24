<template>
    <FSpace>
        <FButton @click="show = true">自定义页脚</FButton>
        <FModal v-model:show="show" title="这里是标题" @ok="show = false">
            您的订单还未支付完成，退出将放弃购买
            <template #footer>
                <FButton type="warning" style="margin-right: 15px">
                    放弃购买
                </FButton>
                <FButton type="success">立即支付</FButton>
            </template>
        </FModal>
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
