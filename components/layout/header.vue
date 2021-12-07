<template>
    <header v-sticky:[fixed] :class="classList">
        <slot></slot>
    </header>
</template>
<script>
import { computed, inject, getCurrentInstance } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import sticky from '../_util/directives/sticky';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, KEY } from './const';

const prefixCls = getPrefixCls('layout');
export default {
    name: COMPONENT_NAME.HEADER,
    directives: {
        sticky,
    },
    props: {
        fixed: {
            type: Boolean,
            default: false,
        },
        inverted: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const vm = getCurrentInstance();
        if (!vm.parent || !vm.parent.type || vm.parent.type.name !== COMPONENT_NAME.LAYOUT) {
            console.warn(`[${COMPONENT_NAME.HEADER}] must be a child of ${COMPONENT_NAME.LAYOUT}`);
        }
        const { addChild } = inject(KEY, { addChild: noop });
        addChild({
            type: COMPONENT_NAME.HEADER,
        });
        const classList = computed(() => [`${prefixCls}-header`, props.inverted && 'is-inverted'].filter(Boolean));
        return {
            classList,
        };
    },
};
</script>
