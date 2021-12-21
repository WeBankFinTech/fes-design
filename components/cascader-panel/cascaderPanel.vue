<template>
    <div :class="prefixCls" @keydown="handleKeyDown">
        <CascaderMenu
            v-for="menu in menus"
            :key="menu.menuId"
            :nodes="menu.nodes"
            :menuId="menu.menuId"
        />
    </div>
</template>
<script>
import { computed, defineComponent, provide, reactive } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import {
    CASCADER_PANEL_INJECTION_KEY,
    DEFAULT_CONFIG,
    EXPAND_TRIGGER,
} from './const';
import usePanel from './usePanel';
import CascaderMenu from './menu';

const prefixCls = getPrefixCls('cascader-panel');

export default defineComponent({
    name: 'FCascaderPanel',
    components: {
        CascaderMenu,
    },
    props: {
        currentValue: [Number, String, Array, Object],
        options: {
            type: Array,
            default: () => [],
        },
        multiple: Boolean,
        nodeConfig: {
            type: Object,
            default: () => {},
        },
        renderLabel: Function,
        handleUpdateSelectedNodes: {
            type: Function,
            required: true,
        },
    },
    emits: ['expandChange', 'checkChange', 'close'],
    setup(props, { emit, slots }) {
        useTheme();
        const renderLabelFn = computed(
            () => props.renderLabel || slots.default,
        );
        const currentMultiple = computed(() => props.multiple);

        const config = computed(() => ({
            ...DEFAULT_CONFIG,
            ...props.nodeConfig,
        }));

        const isHoverMenu = computed(
            () => config.value.expandTrigger === EXPAND_TRIGGER.HOVER,
        );

        const {
            menus,
            setNodeElem,
            expandingNode,
            handleExpandNode,
            handleCheckChange,
            handleKeyDown,
        } = usePanel(config, props, emit);

        provide(
            CASCADER_PANEL_INJECTION_KEY,
            reactive({
                emptyText: '暂无数据',
                config,
                multiple: currentMultiple,
                isHoverMenu,
                renderLabelFn,
                expandingNode,
                handleExpandNode,
                handleCheckChange,
                setNodeElem,
            }),
        );

        return {
            prefixCls,
            menus,
            handleKeyDown,
        };
    },
});
</script>
