<template>
    <div :class="`${prefixCls}-tab-pane`">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { tabProps } from './helper';
import getPrefixCls from '../_util/getPrefixCls';
import { TABS_INJECTION_KEY } from '../_util/constants';

const prefixCls = getPrefixCls('tabs');

export default defineComponent({
    name: 'FTabPane',
    props: tabProps,
    setup() {
        const FTab = inject(TABS_INJECTION_KEY, null);
        if (!FTab) {
            return console.error(
                '[FTabPane]: FTabPane 必须搭配 FTabs 组件使用！',
            );
        }
        return {
            prefixCls,
        };
    },
});
</script>
