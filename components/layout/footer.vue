<template>
    <footer :class="classList">
        <slot></slot>
    </footer>
</template>
<script>
import { inject, computed, getCurrentInstance } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, KEY } from './const';

const prefixCls = getPrefixCls('layout');
export default {
    name: COMPONENT_NAME.FOOTER,
    setup() {
        const vm = getCurrentInstance();
        if (!vm.parent || !vm.parent.type || vm.parent.type.name !== COMPONENT_NAME.LAYOUT) {
            console.warn(`[${COMPONENT_NAME.FOOTER}] must be a child of ${COMPONENT_NAME.LAYOUT}`);
        }
        const { addChild, embedded } = inject(KEY, { addChild: noop, embedded: { value: false } });
        addChild({
            type: COMPONENT_NAME.FOOTER,
        });
        const classList = computed(() => [`${prefixCls}-footer`, embedded.value && 'is-embedded'].filter(Boolean));
        return {
            classList,
        };
    },
};
</script>
