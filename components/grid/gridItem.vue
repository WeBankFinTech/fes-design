<template>
    <div :class="classList" :style="style">
        <slot />
    </div>
</template>

<script>
import { computed, inject } from 'vue';
import { GRID_KEY } from './const';
import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('grid-item');

function validator(value) {
    return value >= 0 && value <= 24;
}

function parseFlex(flex) {
    if (typeof flex === 'number') {
        return `${flex} ${flex} auto`;
    }

    if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
    }

    return flex;
}

export default {
    name: 'FGridItem',
    components: {},
    props: {
        flex: {
            type: [String, Number],
        },
        offset: {
            type: Number,
            default: 0,
            validator,
        },
        pull: {
            type: Number,
            default: 0,
            validator,
        },
        push: {
            type: Number,
            default: 0,
            validator,
        },
        span: {
            type: Number,
            default: 0,
            validator,
        },
        order: {
            type: Number,
            default: 0,
            validator,
        },
    },
    setup(props) {
        const rowProps = inject(GRID_KEY, {
            gutterX: { value: 0 },
        });

        const classList = computed(() => [
            prefixCls,
            props.offset && `${prefixCls}-offset-${props.offset}`,
            props.pull && `${prefixCls}-pull-${props.pull}`,
            props.push && `${prefixCls}-push-${props.push}`,
            props.order && `${prefixCls}-order-${props.order}`,
            `${prefixCls}-${props.span}`,

        ].filter(Boolean));
        const style = computed(() => {
            const _style = {};
            if (props.flex) {
                _style.flex = parseFlex(props.flex);
            }
            if (rowProps.gutterX?.value) {
                _style['padding-left'] = `${rowProps.gutterX.value / 2}px`;
                _style['padding-right'] = `${rowProps.gutterX.value / 2}px`;
            }
            return _style;
        });
        return {
            classList,
            style,
        };
    },
};
</script>
