<template>
    <main :class="classList">
        <slot></slot>
    </main>
</template>
<script lang="ts">
import {
    inject,
    ref,
    computed,
    getCurrentInstance,
    defineComponent,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('layout');

export const layoutMainProps = {
    embedded: {
        type: Boolean,
        default: false,
    },
} as const;

export type LayoutMainProps = ExtractPublicPropTypes<typeof layoutMainProps>;

export default defineComponent({
    name: COMPONENT_NAME.MAIN,
    props: layoutMainProps,
    setup(props) {
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
        return {
            classList,
        };
    },
});
</script>
