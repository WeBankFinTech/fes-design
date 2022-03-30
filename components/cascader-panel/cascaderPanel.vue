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

<script lang="ts">
import { defineComponent, computed, provide, reactive } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { DEFAULT_CONFIG, EXPAND_TRIGGER } from './const';
import usePanel from './usePanel';
import CascaderMenu from './menu.vue';
import { cascaderPanelProps, CASCADER_PANEL_INJECTION_KEY } from './props';

import type { CascaderNodeConfig } from './interface';
import { useLocale } from '../config-provider/useLocale';

const prefixCls = getPrefixCls('cascader-panel');

export default defineComponent({
    name: 'FCascaderPanel',
    components: {
        CascaderMenu,
    },
    props: {
        ...cascaderPanelProps,
    },
    emits: ['expandChange', 'checkChange', 'close'],
    setup(props, { emit, slots }) {
        useTheme();
        const renderLabelFn = computed(
            () => props.renderLabel || slots.default,
        );
        const currentMultiple = computed(() => props.multiple);

        const config = computed<CascaderNodeConfig>(() => ({
            ...DEFAULT_CONFIG,
            ...props.nodeConfig,
        }));

        const isHoverMenu = computed(
            () => config.value.expandTrigger === EXPAND_TRIGGER.HOVER,
        );

        const { t } = useLocale();
        const listEmptyText = computed(
            () => props.emptyText || t('cascader.emptyText'),
        );

        const {
            menus,
            setNodeElem,
            expandingNode,
            handleExpandNode,
            handleCheckChange,
            handleKeyDown,
            handleLoadNode,
        } = usePanel(config, props, emit);

        provide(
            CASCADER_PANEL_INJECTION_KEY,
            reactive({
                emptyText: listEmptyText,
                config,
                multiple: currentMultiple,
                isHoverMenu,
                renderLabelFn,
                expandingNode,
                handleExpandNode,
                handleCheckChange,
                handleLoadNode,
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
