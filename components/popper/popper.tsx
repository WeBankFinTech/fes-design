import { h, defineComponent, Fragment, Teleport, cloneVNode, computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useClickOutSide from '../_util/use/useClickOutSide';
import useResize from '../_util/use/useResize';
import { getFirstValidNode } from '../_util/vnode';
import getElementFromRef from '../_util/getElementFromRef';
import { useTheme } from '../_theme/useTheme';
import useTrigger from './useTrigger';
import usePopper from './usePopper';

import { getConfig } from '../config-provider';

import { popperProps } from './props';

const prefixCls = getPrefixCls('popper');

export default defineComponent({
    name: 'FPopper',
    props: popperProps,
    emits: [UPDATE_MODEL_EVENT],
    setup(props, { slots, emit }) {
        useTheme();
        if (!slots.trigger) {
            throw new Error('[FPopper]: Trigger must be provided');
        }
        const config = getConfig();
        const getContainer = computed(
            () => props.getContainer || config.getContainer,
        );
        const {
            visible,
            updateVisible,
            triggerRef,
            popperRef,
            arrowRef,
            update,
            popperStyle,
            updateVirtualRect,
        } = usePopper(props, emit);
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
            const vNode = getFirstValidNode(slots.trigger!?.(), 1);
            if (vNode) {
                return cloneVNode(vNode, { ref: triggerRef, ...events }, true);
            }
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
