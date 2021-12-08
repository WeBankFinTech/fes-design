<template>
    <div :class="classList" :style="style">
        <slot></slot>
    </div>
</template>

<script>
import { computed, provide } from 'vue';
import { isArray } from 'lodash-es';
import { ALIGN, JUSTIFY, GRID_KEY } from './const';

import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('grid');

export default {
    name: 'FGrid',
    components: {},
    props: {
        align: {
            type: String,
            default: ALIGN[0],
            validator(value) {
                return ALIGN.includes(value);
            },
        },
        gutter: {
            type: [Number, Array],
            default: 0,
        },
        justify: {
            type: String,
            default: JUSTIFY[0],
            validator(value) {
                return JUSTIFY.includes(value);
            },
        },
        wrap: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
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
            const _style = {
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
};
</script>
