/**
 * item component, we need to know their size change at any time
 */

import { cloneVNode, computed, defineComponent, onBeforeUnmount, ref } from 'vue';
import useResize from '../_util/use/useResize';
import { getFirstValidNode } from '../_util/vnode';
import getElementFromVueInstance from '../_util/getElementFromVueInstance';
import { itemProps } from './props';

// wrapping for item
export const FVirtualListItem = defineComponent({
    name: 'FVirtualListItem',
    props: itemProps,
    setup(props, { attrs }) {
        const itemRef = ref();
        let lastReportedSize = 0;
        let sizeCheckTimer: number | null = null;

        // 优化的尺寸变化检测和上报
        const dispatchSizeChange = () => {
            if (!itemRef.value) {
                return;
            }

            const shapeKey = props.horizontal ? 'offsetWidth' : 'offsetHeight';
            const currentSize = itemRef.value[shapeKey] || 0;

            // 只有当尺寸显著变化时才上报，避免频繁的微小变化
            // 阈值可以根据实际情况调整，例如设置为2px
            const sizeThreshold = 2;
            if (Math.abs(currentSize - lastReportedSize) >= sizeThreshold) {
                lastReportedSize = currentSize;
                (attrs as any).onItemResized(props.uniqueKey, currentSize);
            }
        };

        // 防抖的尺寸检查，并确保在组件卸载时清除定时器
        const debouncedSizeCheck = () => {
            if (sizeCheckTimer) {
                clearTimeout(sizeCheckTimer);
            }
            // 稍微增加延迟，减少高频触发，例如 30ms
            sizeCheckTimer = setTimeout(dispatchSizeChange, 16) as any;
        };

        // 使用原有的useResize，但添加防抖
        useResize(
            itemRef,
            debouncedSizeCheck,
            computed(() => !props.observeResize),
        );

        // 清理定时器
        onBeforeUnmount(() => {
            if (sizeCheckTimer) {
                clearTimeout(sizeCheckTimer);
                sizeCheckTimer = null;
            }
        });

        return {
            itemRef,
        };
    },
    render() {
        const { index, source, $slots } = this;
        const vNode = getFirstValidNode(
            $slots.default?.({ index, source }) ?? [],
        );
        if (!vNode) {
            return;
        }
        return cloneVNode(
            vNode,
            {
                ref: (el) => {
                    if (el) {
                        this.itemRef = getElementFromVueInstance(el);
                    }
                },
            },
            true,
        );
    },
});
