<template>
    <section :class="classList">
        <div :class="containerClassRef" :style="containerStyle">
            <slot></slot>
        </div>
    </section>
</template>

<script lang="ts">
import {
    computed,
    provide,
    reactive,
    toRefs,
    inject,
    ref,
    defineComponent,
} from 'vue';
import { isPlainObject, isArray, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY, layoutProps } from './const';
import type { LayoutChild } from './const';

const prefixCls = getPrefixCls('layout');

export default defineComponent({
    name: COMPONENT_NAME.LAYOUT,
    props: layoutProps,
    setup(props) {
        useTheme();
        const isRoot = ref(true);
        // layout可以嵌套，所以layout也可能有父的layout
        const parent = inject(LAYOUT_PROVIDE_KEY, null);
        if (parent) {
            isRoot.value = false;
            parent.addChild({
                type: COMPONENT_NAME.LAYOUT,
            });
        }

        const children = reactive<LayoutChild[]>([]);
        const addChild = (child: LayoutChild) => {
            children.push(child);
        };

        const isHorizontal = computed(() => {
            if (children.length) {
                return children.some(
                    (node) => node.type === COMPONENT_NAME.ASIDE,
                );
            }
            return false;
        });
        const asidePlacement = computed(() => {
            if (children.length > 0) {
                if (children[0].type === COMPONENT_NAME.ASIDE) {
                    return 'left';
                }
                if (
                    children[children.length - 1].type === COMPONENT_NAME.ASIDE
                ) {
                    return 'right';
                }
            }
            return '';
        });
        const classList = computed(() =>
            [
                prefixCls,
                isHorizontal.value && 'is-horizontal',
                props.fixed && 'is-fixed',
                isRoot.value && 'is-root',
            ].filter(Boolean),
        );

        const containerClassRef = computed(() => {
            const base = `${prefixCls}-container`;
            if (isPlainObject(props.containerClass)) {
                return {
                    [base]: true,
                    ...(props.containerClass as object),
                };
            }
            if (isArray(props.containerClass)) {
                return [base, ...props.containerClass];
            }
            if (isString(props.containerClass)) {
                return [base, props.containerClass];
            }
            return [base];
        });

        provide(LAYOUT_PROVIDE_KEY, {
            addChild,
            asidePlacement,
            ...toRefs(props),
        });

        return {
            prefixCls,
            classList,
            containerClassRef,
        };
    },
});
</script>
