import {
    h,
    defineComponent,
    Fragment,
    cloneVNode,
    computed,
    Transition,
} from 'vue';
import LazyTeleport from '../_util/lazyTeleport';
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
            () => props.getContainer || config.value.getContainer,
        );
        const {
            visible,
            updateVisible,
            triggerRef,
            popperRef,
            arrowRef,
            computePopper,
            popperStyle,
            updateVirtualRect,
            placement,
            transitionVisible,
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
            computePopper,
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

        const Content = () => {
            return (
                <div class={popperClass.value}>
                    {slots.default?.()}
                    {props.arrow && (
                        <div ref={arrowRef} class={`${prefixCls}-arrow`}></div>
                    )}
                </div>
            );
        };

        const transitionName = computed(() => {
            const placementValue = placement.value;
            const MAP = {
                bottom: 'up',
                top: 'down',
                left: 'right',
                right: 'left',
            } as const;
            return `fes-slide-${
                MAP[placementValue.split('-')[0] as keyof typeof MAP]
            }`;
        });

        return () => (
            <Fragment>
                {renderTrigger()}
                <LazyTeleport
                    to={getContainer.value?.()}
                    disabled={!props.appendToContainer}
                    show={!props.lazy || visible.value}
                >
                    <div
                        ref={popperRef}
                        class={`${prefixCls}-wrapper`}
                        style={popperStyle}
                        role={'tooltip'}
                        onMouseenter={onPopperMouseEnter}
                        onMouseleave={onPopperMouseLeave}
                    >
                        <Transition
                            name={transitionName.value}
                            onBeforeEnter={computePopper}
                        >
                            <Content v-show={transitionVisible.value} />
                        </Transition>
                    </div>
                </LazyTeleport>
            </Fragment>
        );
    },
});
