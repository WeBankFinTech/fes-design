<template>
    <div :class="classList" :style="style">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, inject } from 'vue';
import { isNumber, isObject, isUndefined } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { GRID_KEY } from './const';

const prefixCls = getPrefixCls('grid-item');

function parseFlex(flex: number | string) {
    if (typeof flex === 'number') {
        return `${flex} ${flex} auto`;
    }

    if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
    }

    return flex;
}

type ColSize = {
    offset?: number;
    pull?: number;
    push?: number;
    span?: number;
};

type GridItemProps = {
    flex?: string | number;
    offset?: number;
    pull?: number;
    push?: number;
    span?: number;
    order?: number;
    xs?: number | ColSize;
    sm?: number | ColSize;
    md?: number | ColSize;
    lg?: number | ColSize;
    xl?: number | ColSize;
    xxl?: number | ColSize;
    xxxl?: number | ColSize;
};

const props = withDefaults(defineProps<GridItemProps>(), {
    offset: 0,
    pull: 0,
    push: 0,
    span: 24,
    order: 0,
});

const rowProps = inject(GRID_KEY, {
    gutterX: { value: 0 },
});

const classList = computed(() => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const;

    const classes: string[] = [
        prefixCls,
        props.offset && `${prefixCls}-offset-${props.offset}`,
        props.pull && `${prefixCls}-pull-${props.pull}`,
        props.push && `${prefixCls}-push-${props.push}`,
        `${prefixCls}-${props.span}`,
    ];

    const sizeClasses: string[] = sizes.reduce((pre, size) => {
        let sizeProps: ColSize = {};
        const propSize = props[size];
        if (isNumber(propSize)) {
            sizeProps.span = propSize;
        } else if (isObject(propSize)) {
            sizeProps = propSize || {};
        }
        return pre.concat([
            !isUndefined(sizeProps.span) &&
                `${prefixCls}-${size}-${sizeProps.span}`,
            (sizeProps.offset || sizeProps.offset === 0) &&
                `${prefixCls}-${size}-offset-${sizeProps.offset}`,
            (sizeProps.pull || sizeProps.pull === 0) &&
                `${prefixCls}-${size}-pull-${sizeProps.pull}`,
            (sizeProps.push || sizeProps.push === 0) &&
                `${prefixCls}-${size}-push-${sizeProps.push}`,
        ]);
    }, []);

    return classes.concat(sizeClasses).filter(Boolean);
});
const style = computed(() => {
    const _style: CSSProperties = {};
    if (props.flex) {
        _style.flex = parseFlex(props.flex);
    }
    if (rowProps.gutterX?.value) {
        _style['padding-left'] = `${rowProps.gutterX.value / 2}px`;
        _style['padding-right'] = `${rowProps.gutterX.value / 2}px`;
    }
    if (props.order) {
        _style['order'] = props.order;
    }
    return _style;
});
</script>

<script lang="ts">
export default {
    name: 'FGridItem',
};
</script>
