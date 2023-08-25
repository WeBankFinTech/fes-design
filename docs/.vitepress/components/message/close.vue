<template>
    <FSpace>
        <FButton @click="handleMessageInfo">普通消息</FButton>
        <FButton @click="handleMessageSuccess">成功消息</FButton>
        <FButton @click="handleMessageClose">关闭所有消息</FButton>
    </FSpace>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import { FMessage } from '@fesjs/fes-design';
export default {
    setup() {
        function handleMessageInfo() {
            FMessage.info({
                closable: true,
                content: '可以手动关闭的消息！',
                afterClose() {
                    console.log(
                        '[message.close] [handleMessageInfo] [afterClose]',
                    );
                },
            });
        }

        function handleMessageSuccess() {
            FMessage.success({
                closable: true,
                content: '可以手动关闭的消息！',
                duration: 10,
                afterClose() {
                    console.log(
                        '[message.close] [handleMessageInfo] [afterClose]',
                    );
                },
            });
        }

        function handleMessageClose() {
            FMessage.destroy();
        }

        return {
            handleMessageInfo,
            handleMessageSuccess,
            handleMessageClose,
        };
    },
};
</script>
