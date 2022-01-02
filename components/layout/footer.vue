<template>
    <footer :class="classList">
        <slot></slot>
    </footer>
</template>

<script setup lang="ts">
import { inject, computed, getCurrentInstance, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

const prefixCls = getPrefixCls('layout');

interface FooterProps {
    embedded?: boolean;
    bordered?: boolean;
    fixed?: boolean;
}

const props = withDefaults(defineProps<FooterProps>(), {
    embedded: false,
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
        `[${COMPONENT_NAME.FOOTER}] must be a child of ${COMPONENT_NAME.LAYOUT}`,
    );
}
const { addChild, embedded } = inject(LAYOUT_PROVIDE_KEY, {
    addChild: noop,
    embedded: ref(false),
});

addChild({
    type: COMPONENT_NAME.FOOTER,
});
const classList = computed(() =>
    [
        `${prefixCls}-footer`,
        props.bordered && 'is-bordered',
        (embedded.value || props.embedded) && 'is-embedded',
        props.fixed && 'is-fixed',
    ].filter(Boolean),
);
</script>

<script>
export default {
    name: COMPONENT_NAME.FOOTER,
};
</script>
