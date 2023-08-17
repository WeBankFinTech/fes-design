<template>
    <FSpace>
        <FButton @click="handleMessageClose">可关闭</FButton>
    </FSpace>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import { FMessage } from '@fesjs/fes-design';
export default {
    setup() {
        function handleMessageClose() {
            FMessage.info({
                closable: true,
                content: '可以手动关闭的消息！',
                afterClose() {
                    FMessage.destroy();
                    console.log(
                        '[message.close] [handleMessageClose] [afterClose]',
                    );
                },
            });
        }

        return {
            handleMessageClose,
        };
    },
};
</script>
