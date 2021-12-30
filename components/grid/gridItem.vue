<template>
    <div :class="classList" :style="style">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, inject } from 'vue';
import { GRID_KEY } from './const';
import getPrefixCls from '../_util/getPrefixCls';

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

type GridItemProps = {
    flex: string | number;
    offset: number;
    pull: number;
    push: number;
    span: number;
    order: number;
};

const props = withDefaults(defineProps<GridItemProps>(), {
    offset: 0,
    pull: 0,
    push: 0,
    span: 0,
    order: 0,
});

const rowProps = inject(GRID_KEY, {
    gutterX: { value: 0 },
});

const classList = computed(() =>
    [
        prefixCls,
        props.offset && `${prefixCls}-offset-${props.offset}`,
        props.pull && `${prefixCls}-pull-${props.pull}`,
        props.push && `${prefixCls}-push-${props.push}`,
        props.order && `${prefixCls}-order-${props.order}`,
        `${prefixCls}-${props.span}`,
    ].filter(Boolean),
);
const style = computed(() => {
    const _style: CSSProperties = {};
    if (props.flex) {
        _style.flex = parseFlex(props.flex);
    }
    if (rowProps.gutterX?.value) {
        _style['padding-left'] = `${rowProps.gutterX.value / 2}px`;
        _style['padding-right'] = `${rowProps.gutterX.value / 2}px`;
    }
    return _style;
});
</script>

<script>
export default {
    name: 'FGridItem',
};
</script>
