<template>
    <header :class="classList">
        <slot></slot>
    </header>
</template>
<script>
import { computed, inject, getCurrentInstance } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, KEY } from './const';

const prefixCls = getPrefixCls('layout');
export default {
    name: COMPONENT_NAME.HEADER,
    props: {
        fixed: {
            type: Boolean,
            default: false,
        },
        bordered: {
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
        if (
            !vm.parent ||
            !vm.parent.type ||
            vm.parent.type.name !== COMPONENT_NAME.LAYOUT
        ) {
            console.warn(
                `[${COMPONENT_NAME.HEADER}] must be a child of ${COMPONENT_NAME.LAYOUT}`,
            );
        }
        const { addChild } = inject(KEY, { addChild: noop });
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
        return {
            prefixCls,
            classList,
        };
    },
};
</script>
