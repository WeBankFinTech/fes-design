import {
    onMounted,
    onBeforeUnmount,
    onActivated,
    onDeactivated,
    ref,
    watch,
    reactive,
} from 'vue';
import { createPopper } from '@popperjs/core';
import { useNormalModel } from '../_util/use/useModel';
import popupManager from '../_util/popupManager';
import getElementFromRef from '../_util/getElementFromRef';

import { Emit } from '../_util/interface';
import type { PopperProps } from './props';
import type { VirtualRect } from './interface';

export default (props: PopperProps, emit: Emit) => {
    const [visible, updateVisible] = useNormalModel(props, emit);
    const virtualRect = ref<VirtualRect | null>(null);
    const triggerRef = ref<HTMLElement>();
    const popperRef = ref<HTMLElement>();
    const arrowRef = ref<HTMLElement>();
    const popperStyle = reactive({
        zIndex: popupManager.nextZIndex(),
    });
    let instance: ReturnType<typeof createPopper> | null;

    const initializePopper = () => {
        if (props.disabled) return;
        const modifiers = [
            {
                name: 'offset',
                options: {
                    offset: [0, props.offset],
                },
            },
        ];
        if (props.arrow) {
            modifiers.push({
                name: 'arrow',
                options: {
                    element: arrowRef.value,
                    padding: ({ popper, placement }) => {
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
        if (!virtualRect.value) {
            instance = createPopper(
                getElementFromRef(triggerRef.value),
                popperRef.value,
                {
                    placement: props.placement,
                    modifiers,
                },
            );
        } else {
            const virtualElement = {
                getBoundingClientRect: () => ({
                    width: 0,
                    height: 0,
                    top: virtualRect.value.y,
                    right: virtualRect.value.x,
                    bottom: virtualRect.value.y,
                    left: virtualRect.value.x,
                }),
                contextElement: getElementFromRef(triggerRef.value),
            };
            instance = createPopper(virtualElement, popperRef.value, {
                placement: props.placement,
                modifiers,
            });
        }
        instance.update();
    };

    const update = () => {
        if (props.disabled) return;
        if (!visible.value) return;
        popperStyle.zIndex = popupManager.nextZIndex();
        if (instance) {
            instance.update();
        } else {
            initializePopper();
        }
    };

    const detachPopper = () => {
        instance?.destroy?.();
        instance = null;
    };

    const updateVirtualRect = (value: VirtualRect) => {
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
    };
};
