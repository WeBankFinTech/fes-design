<template>
    <footer :class="classList">
        <slot />
    </footer>
</template>

<script lang="ts">
import {
    type ComponentObjectPropsOptions,
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    ref,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

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
} as const satisfies ComponentObjectPropsOptions;

export type LayoutFooterProps = ExtractPublicPropTypes<
    typeof layoutFooterProps
>;

export default defineComponent({
    name: COMPONENT_NAME.FOOTER,
    props: layoutFooterProps,
    setup(props) {
        const vm = getCurrentInstance();
        if (
            !vm.parent
            || !vm.parent.type
            || vm.parent.type.name !== COMPONENT_NAME.LAYOUT
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
