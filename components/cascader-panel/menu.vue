<template>
    <div :class="prefixCls">
        <Scrollbar
            :class="`${prefixCls}-dropdown`"
            :containerClass="`${prefixCls}-dropdown__wrap`"
        >
            <ul v-if="!isEmpty" :class="`${prefixCls}-list`" role="menu">
                <CascaderNode
                    v-for="node in nodes"
                    :key="node.nodeId"
                    :node="node"
                    :menuId="menuId"
                />
            </ul>
            <div v-else :class="`${prefixCls}-null`">{{emptyText}}</div>
        </Scrollbar>
    </div>
</template>

<script>
import {
    computed,
    defineComponent,
    inject,
} from 'vue';
import Scrollbar from '../scrollbar';
import CascaderNode from './node';
import getPrefixCls from '../_util/getPrefixCls';
import { CASCADER_PANEL_INJECTION_KEY } from './const';

const prefixCls = getPrefixCls('cascader-menu');

export default defineComponent({
    name: 'FCascaderMenu',
    components: {
        Scrollbar,
        CascaderNode,
    },
    props: {
        nodes: {
            type: Array,
            required: true,
        },
        menuId: {
            type: String,
            required: true,
        },
    },
    emits: [],
    setup(props) {
        const panel = inject(CASCADER_PANEL_INJECTION_KEY);

        const isEmpty = computed(() => props.nodes.length < 1);

        return {
            prefixCls,
            isEmpty,
            emptyText: panel.emptyText,
        };
    },
});
</script>
