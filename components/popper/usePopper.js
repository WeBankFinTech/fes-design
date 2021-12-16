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

export default (props, ctx) => {
    const [visible, updateVisible] = useNormalModel(props, ctx.emit);
    const virtualRect = ref(null);
    const triggerRef = ref(null);
    const popperRef = ref(null);
    const arrowRef = ref(null);
    const popperStyle = reactive({
        zIndex: popupManager.nextZIndex(),
    });
    let instance;

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

    const updateVirtualRect = (value) => {
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
