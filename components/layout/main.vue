<template>
    <main :class="classList">
        <slot></slot>
    </main>
</template>

<script setup lang="ts">
import { inject, ref, computed, getCurrentInstance } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

const prefixCls = getPrefixCls('layout');

interface MainProps {
    embedded?: boolean;
}

const props = withDefaults(defineProps<MainProps>(), {
    embedded: false,
});

const vm = getCurrentInstance();
if (
    !vm.parent ||
    !vm.parent.type ||
    vm.parent.type.name !== COMPONENT_NAME.LAYOUT
) {
    console.warn(
        `[${COMPONENT_NAME.MAIN}] must be a child of ${COMPONENT_NAME.LAYOUT}`,
    );
}
const { addChild, embedded } = inject(LAYOUT_PROVIDE_KEY, {
    addChild: noop,
    embedded: ref(false),
});
addChild({
    type: COMPONENT_NAME.MAIN,
});
const classList = computed(() =>
    [
        `${prefixCls}-main`,
        (embedded.value || props.embedded) && 'is-embedded',
    ].filter(Boolean),
);
</script>

<script lang="ts">
export default {
    name: COMPONENT_NAME.MAIN,
};
</script>
