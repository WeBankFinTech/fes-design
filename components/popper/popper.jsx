import { defineComponent, Fragment, Teleport, cloneVNode, computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { UPDATE_MODEL_EVENT, TRIGGER, PLACEMENT } from '../_util/constants';
import useClickOutSide from '../_util/use/useClickOutSide';
import useResize from '../_util/use/useResize';
import { getFirstValidNode } from '../_util/vnode';
import getElementFromRef from '../_util/getElementFromRef';
import { useTheme } from '../_theme/useTheme';
import useTrigger from './useTrigger';
import usePopper from './usePopper';

import { getConfig } from '../config-provider';

const prefixCls = getPrefixCls('popper');

export const PopperProps = {
    modelValue: {
        type: Boolean,
        default: false,
    },
    trigger: {
        type: String,
        default: 'hover',
        validator(value) {
            return TRIGGER.includes(value);
        },
    },
    placement: {
        type: String,
        default: 'bottom',
        validator(value) {
            return PLACEMENT.includes(value);
        },
    },
    offset: {
        type: Number,
        default: 6,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    arrow: {
        type: Boolean,
        default: false,
    },
    appendToContainer: {
        type: Boolean,
        default: true,
    },
    popperClass: {
        type: String,
        default: '',
    },
    showAfter: {
        type: Number,
        default: 0,
    },
    hideAfter: {
        type: Number,
        default: 200,
    },
    getContainer: {
        type: Function,
    },
};

export default defineComponent({
    name: 'FPopper',
    props: PopperProps,
    emits: [UPDATE_MODEL_EVENT],
    setup(props, ctx) {
        useTheme();
        if (!ctx.slots.trigger) {
            throw new Error('FPopper', 'Trigger must be provided');
        }
        const config = getConfig();
        const getContainer = computed(
            () => props.getContainer || config.getContainer,
        );
        const { slots } = ctx;
        const {
            visible,
            updateVisible,
            triggerRef,
            popperRef,
            arrowRef,
            update,
            popperStyle,
            updateVirtualRect,
        } = usePopper(props, ctx);
        const disabledWatch = computed(() => props.disabled || !visible.value);
        useClickOutSide(
            [triggerRef, popperRef],
            () => {
                updateVisible(false);
            },
            disabledWatch,
        );
        useResize(
            computed(() => getElementFromRef(triggerRef.value)),
            update,
            disabledWatch,
        );
        const { events, onPopperMouseEnter, onPopperMouseLeave } = useTrigger(
            visible,
            updateVisible,
            props,
            updateVirtualRect,
        );
        const popperClass = computed(() =>
            [prefixCls, props.popperClass].filter(Boolean).join(' '),
        );
        const renderTrigger = () => {
            const vNode = getFirstValidNode(slots.trigger?.(), 1);
            return cloneVNode(vNode, { ref: triggerRef, ...events }, true);
        };
        return () => (
            <Fragment>
                {renderTrigger()}
                <Teleport
                    to={getContainer.value?.()}
                    disabled={!props.appendToContainer}
                >
                    <div
                        ref={popperRef}
                        v-show={visible.value}
                        style={popperStyle}
                        class={popperClass.value}
                        role={'tooltip'}
                        onMouseenter={onPopperMouseEnter}
                        onMouseleave={onPopperMouseLeave}
                    >
                        {slots.default?.()}
                        {props.arrow && (
                            <div
                                data-popper-arrow
                                ref={arrowRef}
                                class={`${prefixCls}-arrow`}
                            ></div>
                        )}
                    </div>
                </Teleport>
            </Fragment>
        );
    },
});
