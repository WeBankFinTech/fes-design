<template>
    <div :class="classList" :style="style">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, provide } from 'vue';
import { isArray } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';

import getPrefixCls from '../_util/getPrefixCls';
import { ALIGN, JUSTIFY, GRID_KEY } from './const';
import type { PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('grid');

export const gridProps = {
    align: {
        type: String as PropType<(typeof ALIGN)[number]>,
        default: ALIGN[0],
    },
    gutter: {
        type: [Number, Array] as PropType<number | number[]>,
        default: 0,
    },
    justify: {
        type: String as PropType<(typeof JUSTIFY)[number]>,
        default: JUSTIFY[0],
    },
    wrap: Boolean,
} as const;

export type GridProps = ExtractPublicPropTypes<typeof gridProps>;

export default defineComponent({
    name: 'FGrid',
    props: gridProps,
    setup(props) {
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

        return {
            style,
            classList,
        };
    },
});
</script>
