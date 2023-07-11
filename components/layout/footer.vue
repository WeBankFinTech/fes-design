<template>
    <footer :class="classList">
        <slot></slot>
    </footer>
</template>
<script lang="ts">
import {
    inject,
    computed,
    getCurrentInstance,
    ref,
    defineComponent,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('layout');

export const layoutFooterProps = {
    embedded: {
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
} as const;

export type LayoutFooterProps = ExtractPublicPropTypes<
    typeof layoutFooterProps
>;

export default defineComponent({
    name: COMPONENT_NAME.FOOTER,
    props: layoutFooterProps,
    setup(props) {
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

        return {
            classList,
        };
    },
});
</script>
