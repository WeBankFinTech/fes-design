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

<script setup lang="ts">
import { computed, provide, reactive, useSlots } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { DEFAULT_CONFIG, EXPAND_TRIGGER } from './const';
import usePanel from './usePanel';
import CascaderMenu from './menu.vue';
import {
    CascaderPanelProps,
    cascaderPanelPropsDefaultValue,
    CASCADER_PANEL_INJECTION_KEY,
} from './props';

import type { CascaderNodeConfig, CascaderPanelEmits } from './interface';

const props = withDefaults(defineProps<CascaderPanelProps>(), {
    ...cascaderPanelPropsDefaultValue,
});

const prefixCls = getPrefixCls('cascader-panel');
const emit = defineEmits<CascaderPanelEmits>();
const slots = useSlots();

useTheme();
const renderLabelFn = computed(() => props.renderLabel || slots.default);
const currentMultiple = computed(() => props.multiple);

const config = computed<CascaderNodeConfig>(() => ({
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
</script>

<script>
export default {
    name: 'FCascaderPanel',
};
</script>
