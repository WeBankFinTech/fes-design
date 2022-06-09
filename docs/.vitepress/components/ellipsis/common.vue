<template>
    <FButton @click="handleShow('住在我心里孤独的')">点我</FButton>
    <FButton
        @click="
            handleShow(
                '住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪',
            )
        "
    >
        点我
    </FButton>
    <FModal
        v-model:show="show[0]"
        title="这里是标题"
        displayDirective="show"
        @ok="show[0] = false"
    >
        <FEllipsis :content="text" style="max-width: 240px"> </FEllipsis>
    </FModal>
</template>
<script>
import { ref, reactive } from 'vue';
export default {
    setup() {
        const text = ref('');
        const show = reactive([]);

        const handleShow = (_text) => {
            text.value = _text;
            show[0] = true;
        };
        return {
            text,
            show,
            handleShow,
        };
    },
};
</script>
