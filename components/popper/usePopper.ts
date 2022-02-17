import {
    onMounted,
    onBeforeUnmount,
    onActivated,
    onDeactivated,
    ref,
    watch,
    reactive,
    nextTick,
} from 'vue';
import { createPopper } from '@popperjs/core';
import type { Modifier, ModifierArguments } from '@popperjs/core';
import { useNormalModel } from '../_util/use/useModel';
import popupManager from '../_util/popupManager';
import getElementFromRef from '../_util/getElementFromRef';
import { addClass, removeClass } from '../_util/dom';

import type { PopperProps } from './props';
import type { VirtualRect, Placement, Popper } from './interface';

const getTransitionName = (placement: string, enter = true) => {
    const MAP = {
        bottom: 'up',
        top: 'down',
        left: 'right',
        right: 'left',
    } as const;
    return `fes-slide-${MAP[placement.split('-')[0] as keyof typeof MAP]}-${
        enter ? 'enter' : 'leave'
    }-active`;
};

const animate = (el: HTMLElement, placement: string, enter = true) => {
    const className = getTransitionName(placement, enter);
    addClass(el, className);
    el.addEventListener('animationend', () => {
        removeClass(el, className);
    });
    el.addEventListener('animationcancel', () => {
        removeClass(el, className);
    });
};

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
            transitionVisible.value = visible.value;
        } else {
            const $wrapper = popperRef.value.children[0] as HTMLElement;
            $wrapper.addEventListener(
                'animationend',
                () => {
                    transitionVisible.value = visible.value;
                },
                {
                    once: true,
                },
            );
        }
    });

    let instance: ReturnType<typeof createPopper> | null;

    const updateInstance = () => {
        instance.update().then(() => {
            const $wrapper = popperRef.value.children[0] as HTMLElement;
            animate($wrapper, placement.value);
        });
    };

    const initializePopper = () => {
        if (props.disabled) return;
        if (!visible.value) return;
        nextTick(() => {
            const triggerElement = virtualRect.value
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
            const modifiers: Partial<Modifier<string, object>>[] = [
                {
                    name: 'offset',
                    options: {
                        offset: [0, props.offset],
                    },
                },
                {
                    name: 'collectPlacement',
                    enabled: true,
                    phase: 'main',
                    fn({ state }: ModifierArguments<object>) {
                        placement.value = state.placement;
                    },
                },
            ];
            if (props.arrow) {
                modifiers.push({
                    name: 'arrow',
                    options: {
                        element: arrowRef.value,
                        padding: ({
                            popper,
                            placement,
                        }: {
                            popper: Popper;
                            placement: Placement;
                        }) => {
                            const offset = 16;
                            if (placement.endsWith('end')) {
                                return {
                                    left: popper.width - offset,
                                    top: popper.height - offset,
                                };
                            }
                            if (placement.endsWith('start')) {
                                return {
                                    right: popper.width - offset,
                                    bottom: popper.height - offset,
                                };
                            }
                            return 0;
                        },
                    },
                });
            }
            instance = createPopper(
                triggerElement,
                popperRef.value as HTMLElement,
                {
                    placement: props.placement,
                    modifiers,
                },
            );
            updateInstance();
        });
    };

    const update = () => {
        if (props.disabled) return;
        if (!visible.value) {
            const $wrapper = popperRef.value.children[0] as HTMLElement;
            animate($wrapper, placement.value, false);
            return;
        }
        popperStyle.zIndex = popupManager.nextZIndex();
        if (instance) {
            updateInstance();
        } else {
            initializePopper();
        }
    };

    const detachPopper = () => {
        instance?.destroy?.();
        instance = null;
    };

    const updateVirtualRect = (value: VirtualRect | null) => {
        virtualRect.value = value;
    };

    watch(visible, update);
    watch(virtualRect, initializePopper);
    onMounted(initializePopper);
    onBeforeUnmount(detachPopper);
    onActivated(initializePopper);
    onDeactivated(detachPopper);

    return {
        visible,
        updateVisible,
        triggerRef,
        popperRef,
        arrowRef,
        initializePopper,
        detachPopper,
        popperStyle,
        update,
        updateVirtualRect,
        placement,
        transitionVisible,
    };
};
