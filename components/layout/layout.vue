<template>
    <section :class="classList">
        <div :class="containerClassRef" :style="containerStyle">
            <slot></slot>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    computed,
    provide,
    reactive,
    toRefs,
    inject,
    ref,
    Ref,
    CSSProperties,
    ToRefs,
} from 'vue';
import { isPlainObject, isArray, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

export interface LayoutChild {
    type: COMPONENT_NAME;
}

export type AsidePlacement = 'left' | 'right' | '';

export interface LayoutProps {
    embedded?: boolean;
    fixed?: boolean;
    containerClass?: CSSProperties;
    containerStyle?: CSSProperties;
}

export interface LayoutInst extends ToRefs<LayoutProps> {
    addChild: (child: LayoutChild) => void;
    asidePlacement?: Ref<AsidePlacement>;
}

const prefixCls = getPrefixCls('layout');

const props = withDefaults(defineProps<LayoutProps>(), {
    embedded: false,
    fixed: false,
});
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
        if (children[children.length - 1].type === COMPONENT_NAME.ASIDE) {
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

provide(LAYOUT_PROVIDE_KEY, {
    addChild,
    asidePlacement,
    ...toRefs(props),
});
</script>

<script lang="ts">
export default {
    name: COMPONENT_NAME.LAYOUT,
};
</script>
