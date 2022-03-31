import { onMounted, onActivated, ref, watch, reactive, nextTick } from 'vue';
import { computePosition, offset, flip, arrow } from '@floating-ui/dom';
import { useNormalModel } from '../_util/use/useModel';
import popupManager from '../_util/popupManager';
import getElementFromRef from '../_util/getElementFromRef';

import type { PopperProps } from './props';
import type { VirtualRect } from './interface';

export default (props: PopperProps, emit: any) => {
    const [visible, updateVisible] = useNormalModel(props, emit);
    const virtualRect = ref<VirtualRect | null>(null);
    const triggerRef = ref<HTMLElement>();
    const popperRef = ref<HTMLElement>();
    const arrowRef = ref<HTMLElement>();
    const popperStyle = reactive({
        zIndex: popupManager.nextZIndex(),
    });
    const placement = ref(props.placement);

    const transitionVisible = ref(visible.value);

    watch(visible, () => {
        if (visible.value) {
            // 当一次创建时，需要延后更新，不然不触发Transition
            nextTick(() => {
                transitionVisible.value = visible.value;
            });
        } else {
            transitionVisible.value = visible.value;
        }
    });

    const computePopper = () => {
        if (props.disabled) return;
        if (!visible.value) return;
        popperStyle.zIndex = popupManager.nextZIndex();
        nextTick(() => {
            const triggerEl = virtualRect.value
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
                      contextElement: getElementFromRef(triggerRef.value),
                  }
                : getElementFromRef(triggerRef.value);
            const popperEl = popperRef.value;
            computePosition(triggerEl, popperEl, {
                placement: props.placement,
                middleware: [
                    offset(props.offset),
                    flip(),
                    props.arrow && arrow({ element: arrowRef.value }),
                ].filter(Boolean),
            }).then((state) => {
                // 当方向改变时，动画需要重新执行
                if (placement.value !== state.placement) {
                    transitionVisible.value = false;
                    nextTick(() => {
                        transitionVisible.value = true;
                    });
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
        placement,
        transitionVisible,
    };
};
