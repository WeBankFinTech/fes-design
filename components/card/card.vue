<template>
    <div :class="classes">
        <div v-if="$slots.header || header" :class="headerClasses">
            <slot name="header">{{ header }}</slot>
        </div>
        <div :class="`${prefixCls}__body`" :style="bodyStyle">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { cardProps } from './props';

const prefixCls = getPrefixCls('card');

export default defineComponent({
    name: 'FCard',
    props: cardProps,
    setup(props) {
        useTheme();

        const classes = computed(() => ({
            [prefixCls]: true,
            [`${prefixCls}-size--${props.size}`]: props.size,
            [`${prefixCls}-shadow--${props.shadow}`]: props.shadow,
            'is-bordered': props.bordered,
        }));

        const headerClasses = computed(() => ({
            [`${prefixCls}__header`]: true,
            'no-divider': !props.divider,
        }));

        return {
            prefixCls,
            classes,
            headerClasses,
        };
    },
});
</script>
