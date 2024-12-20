import { computed, nextTick, onActivated, onMounted, reactive, ref, watch } from 'vue';
import { type ReferenceElement, arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { isBoolean, isFunction } from 'lodash-es';
import { useVModel } from '@vueuse/core';
import popupManager from '../_util/popupManager';
import getElementFromVueInstance from '../_util/getElementFromVueInstance';

import type { PopperProps } from './props';
import type { VirtualRect } from './interface';

const MAP = {
    bottom: 'up',
    top: 'down',
    left: 'right',
    right: 'left',
} as const;

export default (props: PopperProps, emit: any) => {
    const visible = useVModel(props, 'modelValue', emit, {
        passive: props.passive,
    });
    const updateVisible = (val: boolean) => {
        visible.value = val;
    };
    const virtualRect = ref<VirtualRect | null>(null);
    const triggerRef = ref<HTMLElement>();
    const popperRef = ref<HTMLElement>();
    const arrowRef = ref<HTMLElement>();
    const popperStyle = reactive({
        zIndex: popupManager.nextZIndex(),
    });
    const placement = ref(props.placement);
    const cacheVisible = ref(true);

    const transitionName = computed(() => {
        const placementValue = placement.value;
        return `fes-slide-${MAP[placementValue.split('-')[0] as keyof typeof MAP]}`;
    });

    const computePopper = () => {
        if (isBoolean(props.disabled) && props.disabled) {
            return;
        }
        if (isFunction(props.disabled) && props.disabled()) {
            return;
        }
        if (!visible.value) {
            return;
        }
        popperStyle.zIndex = popupManager.nextZIndex();

        nextTick(() => {
            const rawTriggerEl = getElementFromVueInstance(triggerRef.value);
            const triggerRect = rawTriggerEl.getBoundingClientRect();
            // trigger 不可见的时候立即隐藏，允许误差
            if (triggerRect.width <= 1 && triggerRect.height <= 1) {
                updateVisible(false);
                return;
            }

            const triggerEl: ReferenceElement
                = props.trigger === 'contextmenu' // 仅在右键时，使用鼠标具体触发位置
                    ? {
                            getBoundingClientRect: () =>
                                virtualRect.value && {
                                    width: 0,
                                    height: 0,
                                    top: virtualRect.value.y,
                                    right: virtualRect.value.x,
                                    bottom: virtualRect.value.y,
                                    left: virtualRect.value.x,
                                },
                            contextElement: rawTriggerEl,
                        }
                    : rawTriggerEl;

            const popperEl = popperRef.value;
            computePosition(triggerEl, popperEl, {
                placement: props.placement,
                middleware: [
                    offset(props.offset),
                    // 当位置不够时切换到对面方向
                    flip(),
                    // 当无法完全显示时，自动调整主轴位置
                    shift(),
                    props.arrow && arrow({ element: arrowRef.value }),
                ].filter(Boolean),
            }).then((state) => {
                // 当方向改变时，动画需要重新执行
                if (placement.value !== state.placement) {
                    cacheVisible.value = false;
                    nextTick(() => {
                        cacheVisible.value = true;
                    });
                    placement.value = state.placement;
                    return;
                }
                placement.value = state.placement;

                Object.assign(popperEl.style, {
                    left: `${state.x}px`,
                    top: `${state.y}px`,
                });

                if (props.arrow) {
                    // Accessing the data
                    const { x: arrowX, y: arrowY } = state.middlewareData.arrow;

                    const staticSide = {
                        top: 'bottom',
                        right: 'left',
                        bottom: 'top',
                        left: 'right',
                    }[state.placement.split('-')[0]];

                    Object.assign(arrowRef.value.style, {
                        left: arrowX != null ? `${arrowX}px` : '',
                        top: arrowY != null ? `${arrowY}px` : '',
                        right: '',
                        bottom: '',
                        [staticSide]: '-3px',
                    });
                }
            });
        });
    };

    const updateVirtualRect = (value: VirtualRect | null) => {
        virtualRect.value = value;
    };

    watch(virtualRect, computePopper);
    onMounted(computePopper);
    onActivated(computePopper);

    return {
        visible,
        updateVisible,
        triggerRef,
        popperRef,
        arrowRef,
        popperStyle,
        computePopper,
        updateVirtualRect,
        cacheVisible,
        transitionName,
    };
};
