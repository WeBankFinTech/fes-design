<template>
    <section :class="classList">
        <slot></slot>
    </section>
</template>
<script>
import {
    computed, provide, reactive, toRefs, inject, ref,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME, KEY } from './const';

const prefixCls = getPrefixCls('layout');
export default {
    name: COMPONENT_NAME.LAYOUT,
    props: {
        embedded: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
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
                    node => node.type === COMPONENT_NAME.HEADER
                        || node.type === COMPONENT_NAME.FOOTER,
                );
            }
            return false;
        });
        const asiderPlacement = computed(() => {
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
        const classList = computed(() => [
            prefixCls,
            isVertical.value && 'is-vertical',
            isRoot.value && 'is-root',
        ].filter(Boolean));

        provide(KEY, {
            addChild,
            asiderPlacement,
            ...toRefs(props),
        });
        return {
            classList,
        };
    },
};
</script>
