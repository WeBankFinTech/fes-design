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

<script setup lang="ts">
import { computed, inject } from 'vue';
import Scrollbar from '../scrollbar';
import CascaderNodeComp from './node.vue';
import getPrefixCls from '../_util/getPrefixCls';
import { CASCADER_PANEL_INJECTION_KEY } from './props';

import type { CascaderNode } from './interface';

const prefixCls = getPrefixCls('cascader-menu');

interface CascaderMenuProps {
    nodes: CascaderNode[];
    menuId: string;
}

const props = withDefaults(defineProps<CascaderMenuProps>(), {});

const panel = inject(CASCADER_PANEL_INJECTION_KEY);
const emptyText = computed(() => panel.emptyText);
const isEmpty = computed(() => props.nodes.length < 1);
</script>

<script lang="ts">
export default {
    name: 'FCascaderMenu',
};
</script>
