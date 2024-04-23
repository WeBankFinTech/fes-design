<template>
    <header :class="classList">
        <slot />
    </header>
</template>
<script lang="ts">
import {
    type ComponentObjectPropsOptions,
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

const prefixCls = getPrefixCls('layout');

export const layoutHeaderProps = {
    inverted: {
        type: Boolean,
        default: false,
    },
    bordered: {
        type: Boolean,
        default: false,
    },
    fixed: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type LayoutHeaderProps = ExtractPublicPropTypes<
    typeof layoutHeaderProps
>;

export default defineComponent({
    name: COMPONENT_NAME.HEADER,
    props: layoutHeaderProps,
    setup(props) {
        const vm = getCurrentInstance();
        if (
            !vm.parent
            || !vm.parent.type
            || vm.parent.type.name !== COMPONENT_NAME.LAYOUT
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
        return {
            classList,
        };
    },
});
</script>
