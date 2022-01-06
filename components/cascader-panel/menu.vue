<template>
    <div :class="prefixCls">
        <Scrollbar
            :class="`${prefixCls}-dropdown`"
            :containerClass="`${prefixCls}-dropdown__wrap`"
        >
            <ul v-if="!isEmpty" :class="`${prefixCls}-list`" role="menu">
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

import type { CascaderNode } from './interface';

const prefixCls = getPrefixCls('cascader-menu');

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
    },
    props: cascaderMenuProps,
    setup(props) {
        const panel = inject(CASCADER_PANEL_INJECTION_KEY);
        const isEmpty = computed(() => props.nodes.length < 1);
        const emptyText = computed(() => panel.emptyText);

        return {
            prefixCls,
            isEmpty,
            emptyText,
        };
    },
});
</script>
