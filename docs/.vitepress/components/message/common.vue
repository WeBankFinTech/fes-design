<template>
    <FSpace>
        <FButton
            v-for="(label, value) in typeMap"
            :key="value"
            @click="handleClick(value)"
        >
            {{ label }}
        </FButton>
    </FSpace>
</template>

<script>
import { FMessage } from '@fesjs/fes-design';

export default {
    setup() {
        const typeMap = {
            info: '普通消息',
            success: '成功消息',
            warning: '警告消息',
            error: '错误消息',
        };
        function handleClick(type, colorful) {
            FMessage[type]?.({
                content: `这是一条${typeMap[type]}！`,
                colorful,
            });
        }
        return {
            typeMap,
            handleClick,
        };
    },
};
</script>
