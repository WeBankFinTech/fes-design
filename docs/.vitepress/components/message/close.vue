<template>
    <FSpace>
        <FButton @click="handleMessageInfo">普通消息</FButton>
        <FButton @click="handleMessageInfoClose">关闭普通消息</FButton>
    </FSpace>
    <FSpace>
        <FButton @click="handleMessageSuccess">成功消息</FButton>
        <FButton @click="handleMessageSuccessClose">关闭成功消息</FButton>
    </FSpace>
    <FSpace>
        <FButton @click="handleMessageClose">关闭所有消息</FButton>
    </FSpace>
</template>

<script>
import { FMessage } from '@fesjs/fes-design';
export default {
    setup() {
        let messageInfo = null;
        let messageSuccess = null;

        function handleMessageInfo() {
            messageInfo = FMessage.info({
                closable: true,
                content: '可以手动关闭的普通消息！',
                duration: 10,
                afterClose() {
                    console.log(
                        '[message.close] [handleMessageInfo] [afterClose]',
                    );
                },
            });
        }

        function handleMessageSuccess() {
            messageSuccess = FMessage.success({
                closable: true,
                content: '可以手动关闭的成功消息！',
                duration: 10,
                afterClose() {
                    console.log(
                        '[message.close] [handleMessageInfo] [afterClose]',
                    );
                },
            });
        }

        function handleMessageInfoClose() {
            messageInfo?.destroy();
        }
        function handleMessageSuccessClose() {
            messageSuccess?.destroy();
        }

        function handleMessageClose() {
            FMessage.destroy();
        }

        return {
            handleMessageInfo,
            handleMessageSuccess,
            handleMessageInfoClose,
            handleMessageSuccessClose,
            handleMessageClose,
        };
    },
};
</script>
