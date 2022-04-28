<template>
    <div :class="prefixCls">
        <Scrollbar
            :class="`${prefixCls}-dropdown`"
            :containerClass="`${prefixCls}-dropdown__wrap`"
        >
            <div v-if="!initialLoaded" :class="`${prefixCls}-loading`">
                <Spin></Spin>
            </div>
            <ul v-else-if="!isEmpty" :class="`${prefixCls}-list`" role="menu">
                <CascaderNodeComp
                    v-for="node in nodes"
                    :key="node.nodeId"
                    :node="node"
                    :menuId="menuId"
                />
            </ul>
            <div v-else :class="`${prefixCls}-null`">{{ emptyText }}</div>
        </Scrollbar>
    </div>
</template>

<script lang="ts">
import { computed, inject, PropType, defineComponent } from 'vue';
import Scrollbar from '../scrollbar';
import CascaderNodeComp from './node.vue';
import getPrefixCls from '../_util/getPrefixCls';
import { CASCADER_PANEL_INJECTION_KEY } from './props';
import Spin from '../spin';

import type { CascaderNode } from './getNode';

const prefixCls = getPrefixCls('cascader-v1-menu');

const cascaderMenuProps = {
    nodes: {
        type: Array as PropType<CascaderNode[]>,
        required: true,
    },
    menuId: {
        type: String,
        required: true,
    },
} as const;

export default defineComponent({
    name: 'FCascaderMenu',
    components: {
        Scrollbar,
        CascaderNodeComp,
        Spin,
    },
    props: cascaderMenuProps,
    setup(props) {
        const panel = inject(CASCADER_PANEL_INJECTION_KEY);
        const isEmpty = computed(() => props.nodes.length < 1);
        const emptyText = computed(() => panel.emptyText);
        const initialLoaded = computed(() => panel.initialLoaded);

        return {
            prefixCls,
            isEmpty,
            emptyText,
            initialLoaded,
        };
    },
});
</script>
