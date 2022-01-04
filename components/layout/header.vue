<template>
    <header :class="classList">
        <slot></slot>
    </header>
</template>

<script setup lang="ts">
import { computed, inject, getCurrentInstance } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

const prefixCls = getPrefixCls('layout');

interface HeaderProps {
    inverted?: boolean;
    bordered?: boolean;
    fixed?: boolean;
}

const props = withDefaults(defineProps<HeaderProps>(), {
    inverted: false,
    bordered: false,
    fixed: false,
});

const vm = getCurrentInstance();
if (
    !vm.parent ||
    !vm.parent.type ||
    vm.parent.type.name !== COMPONENT_NAME.LAYOUT
) {
    console.warn(
        `[${COMPONENT_NAME.HEADER}] must be a child of ${COMPONENT_NAME.LAYOUT}`,
    );
}
const { addChild } = inject(LAYOUT_PROVIDE_KEY, { addChild: noop });
addChild({
    type: COMPONENT_NAME.HEADER,
});
const classList = computed(() =>
    [
        `${prefixCls}-header`,
        props.fixed && 'is-fixed',
        props.inverted && 'is-inverted',
        props.bordered && 'is-bordered',
    ].filter(Boolean),
);
</script>

<script lang="ts">
export default {
    name: COMPONENT_NAME.HEADER,
};
</script>
