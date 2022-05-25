<template>
    <FSpace ref="wrapRef">
        <FButton @click="handleCustomContent">自定义内容</FButton>
    </FSpace>
</template>

<script lang="jsx">
import { h, ref } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { FMessage } from '@fesjs/fes-design';
// eslint-disable-next-line import/no-unresolved
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

        return {
            wrapRef,
            handleCustomContent,
        };
    },
};
</script>
