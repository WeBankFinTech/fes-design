<template>
    <FSpace>
        <FButton @click="() => FMessage.info('该提示将在10s后关闭', 10)">
            自定义时长
        </FButton>
    </FSpace>
</template>

<script>
import { FMessage } from '@fesjs/fes-design';

export default {
    setup() {
        return {
            FMessage,
        };
    },
};
</script>
