<template>
    <main :class="classList">
        <slot></slot>
    </main>
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

export const layoutMainProps = {
    embedded: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type LayoutMainProps = ExtractPublicPropTypes<typeof layoutMainProps>;

export default defineComponent({
    name: COMPONENT_NAME.MAIN,
    props: layoutMainProps,
    setup(props) {
        const vm = getCurrentInstance();
        if (
            !vm.parent
            || !vm.parent.type
            || vm.parent.type.name !== COMPONENT_NAME.LAYOUT
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
        return {
            classList,
        };
    },
});
</script>
