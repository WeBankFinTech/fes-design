import {
    Fragment,
    Transition,
    cloneVNode,
    computed,
    defineComponent,
} from 'vue';
import { isBoolean, isFunction } from 'lodash-es';
import LazyTeleport from '../_util/components/lazyTeleport';
import getPrefixCls from '../_util/getPrefixCls';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useClickOutSide from '../_util/use/useClickOutSide';
import useResize from '../_util/use/useResize';
import { getFirstValidNode } from '../_util/vnode';
import getElementFromVueInstance from '../_util/getElementFromVueInstance';
import { useTheme } from '../_theme/useTheme';
import { useConfig } from '../config-provider';
import useTrigger from './useTrigger';
import usePopper from './usePopper';
import useScroll from './useScroll';

import { popperProps } from './props';

const prefixCls = getPrefixCls('popper');

export default defineComponent({
    name: 'FPopper',
    props: popperProps,
    emits: [UPDATE_MODEL_EVENT, 'clickOutside'],
    setup(props, { slots, emit, expose }) {
        useTheme();
        if (!slots.trigger) {
            throw new Error('[FPopper]: Trigger must be provided');
        }
        const config = useConfig();
        const getContainer = computed(
            () => props.getContainer || config.getContainer?.value,
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
            cacheVisible,
            transitionName,
        } = usePopper(props, emit);

        const disabledWatch = computed(
            () =>
                (isBoolean(props.disabled) ? props.disabled : false)
                || !visible.value,
        );

        const triggerElement = computed(() => {
            const elm = getElementFromVueInstance(triggerRef.value);
            if (elm instanceof Text) {
                throw new TypeError(
                    `FPopper: trigger must be a Element, but get Text(${elm.nodeValue})`,
                );
            }
            return elm;
        });

        useScroll(triggerElement, (e: Event) => {
            if (disabledWatch.value) {
                return;
            }
            if (isFunction(props.disabled) && props.disabled()) {
                return;
            }
            // 不挂载在container上
            if (!props.appendToContainer) {
                return;
            }
            if (e.target === getContainer.value?.()) {
                return;
            }
            computePopper();
        });
        useClickOutSide(
            [triggerRef, popperRef],
            () => {
                updateVisible(false);
                emit('clickOutside');
            },
            disabledWatch,
        );
        useResize(triggerElement, computePopper, disabledWatch);
        useResize(
            computed(() => getElementFromVueInstance(popperRef.value)),
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
            [prefixCls, props.popperClass].filter(Boolean),
        );

        const renderTrigger = () => {
            const vNode = getFirstValidNode(slots.trigger?.());
            if (vNode) {
                return cloneVNode(
                    vNode,
                    { ref: triggerRef, ...events.value },
                    true,
                );
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

        expose({
            updatePopperPosition() {
                computePopper();
            },
        });

        return () => (
            <Fragment>
                {renderTrigger()}
                <LazyTeleport
                    to={getContainer.value?.()}
                    disabled={!props.appendToContainer}
                    show={Boolean(!props.lazy || visible.value)}
                >
                    <div
                        ref={popperRef}
                        class={`${prefixCls}-wrapper`}
                        style={[popperStyle, props.popperStyle]}
                        role={'tooltip'}
                        onMouseenter={onPopperMouseEnter}
                        onMouseleave={onPopperMouseLeave}
                    >
                        <Transition
                            name={transitionName.value}
                            type="animation"
                            appear
                            onBeforeEnter={computePopper}
                        >
                            <Content
                                v-show={visible.value && cacheVisible.value}
                            />
                        </Transition>
                    </div>
                </LazyTeleport>
            </Fragment>
        );
    },
});
