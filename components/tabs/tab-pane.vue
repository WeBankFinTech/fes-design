<template>
    <div :class="`${prefixCls}-tab-pane`">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { TABS_INJECTION_KEY } from '../_util/constants';

const prefixCls = getPrefixCls('tabs');

const WTab = inject(TABS_INJECTION_KEY, null);
if (!WTab) {
    console.error('[FTabPane]: FTabPane 必须搭配 WTab 组件使用！');
}
</script>

<script>
export default {
    name: 'FTabPane',
};
</script>
