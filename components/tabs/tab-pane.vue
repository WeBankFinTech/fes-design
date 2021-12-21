<template>
    <div :class="`${prefixCls}-tab-pane`">
        <slot />
    </div>
</template>

<script>
import { inject } from 'vue';
import { tabProps } from './helper';
import getPrefixCls from '../_util/getPrefixCls';
import { TABS_INJECTION_KEY } from '../_util/constants';

const prefixCls = getPrefixCls('tabs');

export default {
    name: 'FTabPane',
    props: tabProps,
    setup() {
        const WTab = inject(TABS_INJECTION_KEY, null);
        if (!WTab) {
            return console.error('[FTabPane]: FTabPane 必须搭配 WTab 组件使用！');
        }
        return {
            prefixCls,
        };
    },
};
</script>

<style></style>
