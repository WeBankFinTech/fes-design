<template>
    <div :class="classList" :style="style">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, provide } from 'vue';
import { isArray } from 'lodash-es';
import { ALIGN, JUSTIFY, GRID_KEY } from './const';
import { useTheme } from '../_theme/useTheme';

import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('grid');

type GridProps = {
    align: typeof ALIGN[number];
    gutter: number | number[];
    justify: typeof JUSTIFY[number];
    wrap: boolean;
};

const props = withDefaults(defineProps<GridProps>(), {
    align: ALIGN[0],
    gutter: 0,
    justify: JUSTIFY[0],
    wrap: false,
});

useTheme();
const gutterX = computed(() => {
    if (isArray(props.gutter)) {
        return props.gutter[0];
    }
    return props.gutter;
});
const gutterY = computed(() => {
    if (isArray(props.gutter)) {
        return props.gutter[1];
    }
    return 0;
});
const style = computed(() => {
    const _style: CSSProperties = {
        'flex-wrap': props.wrap ? 'wrap' : 'nowrap',
        'justify-content': props.justify,
        'align-items': props.align,
    };
    if (gutterX.value) {
        _style['margin-left'] = `-${gutterX.value / 2}px`;
        _style['margin-right'] = `-${gutterX.value / 2}px`;
    }
    if (gutterY.value) {
        _style['row-gap'] = `${gutterY.value}px`;
    }
    return _style;
});
const classList = computed(() => {
    const arr = [prefixCls];
    return arr;
});

provide(GRID_KEY, {
    gutterX,
});
</script>

<script lang="ts">
export default {
    name: 'FGrid',
};
</script>
