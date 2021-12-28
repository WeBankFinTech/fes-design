<template>
    <section :class="classList">
        <div :class="containerClassRef" :style="containerStyle">
            <slot></slot>
        </div>
    </section>
</template>
<script>
import { computed, provide, reactive, toRefs, inject, ref } from 'vue';
import { isPlainObject, isArray, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { COMPONENT_NAME, KEY } from './const';
// import scrollbar from '../scrollbar/scrollbar';

const prefixCls = getPrefixCls('layout');
export default {
    name: COMPONENT_NAME.LAYOUT,
    components: {},
    props: {
        embedded: {
            type: Boolean,
            default: false,
        },
        fixed: {
            type: Boolean,
            default: false,
        },
        containerClass: [Array, Object, String],
        containerStyle: Object,
    },
    setup(props) {
        useTheme();
        const isRoot = ref(true);
        // layout可以嵌套，所以layout也可能有父的layout
        const parent = inject(KEY, null);
        if (parent) {
            isRoot.value = false;
            parent.addChild({
                type: COMPONENT_NAME.LAYOUT,
            });
        }
        const children = reactive([]);
        const addChild = (child) => {
            children.push(child);
        };
        const isVertical = computed(() => {
            if (children.length) {
                return children.some(
                    (node) =>
                        node.type === COMPONENT_NAME.HEADER ||
                        node.type === COMPONENT_NAME.FOOTER,
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
                isVertical.value && 'is-vertical',
                props.fixed && 'is-fixed',
                isRoot.value && 'is-root',
            ].filter(Boolean),
        );

        const containerClassRef = computed(() => {
            const base = `${prefixCls}-container`;
            if (isPlainObject(props.containerClass)) {
                return {
                    [base]: true,
                    ...props.containerClass,
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

        provide(KEY, {
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
};
</script>
