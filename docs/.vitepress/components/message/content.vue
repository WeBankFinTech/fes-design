<template>
    <FSpace ref="wrapRef">
        <FButton @click="handleCustomContent">自定义内容</FButton>
        <FButton @click="handleClosableContent">消息内容点击即可关闭</FButton>
    </FSpace>
</template>

<script lang="jsx">
import { h, ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';
import { BellOffOutlined } from '../../../theme/IconDoc/icons.js';

export default {
    setup() {
        const wrapRef = ref(null);
        // FMessage.config({
        //     getContainer() {
        //         return wrapRef.value.$el;
        //     },
        // });
        function handleCustomContent() {
            FMessage.info({
                content: () =>
                    h('div', { style: { color: 'red' } }, '自定义内容'),
                icon: () => <BellOffOutlined />,
            });
        }

        function handleClosableContent() {
            let messageInfo;
            function handleCloseMessage() {
                messageInfo?.destroy();
            }

            messageInfo = FMessage.warning({
                duration: 10,
                closable: true,
                content: () => <div style={{ cursor: 'pointer' }} onClick={handleCloseMessage}>点击消息即可关闭</div>,
                icon: () => <BellOffOutlined />,
            });
        }

        return {
            wrapRef,
            handleCustomContent,
            handleClosableContent,
        };
    },
};
</script>
