import {
    h,
    ref,
    watch,
    nextTick,
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
            transitionVisible,
            triggerRef,
            popperRef,
            arrowRef,
            update,
            popperStyle,
            updateVirtualRect,
            placement,
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

        const contentRef = ref();
        const contentStyle = ref();

        watch(transitionVisible, () => {
            if (transitionVisible.value) {
                nextTick(() => {
                    contentStyle.value = {
                        width: contentRef.value.offsetWidth + 'px',
                        height: contentRef.value.offsetHeight + 'px',
                    };
                });
            }
        });

        const renderContentCopy = () => {
            if (visible.value && !transitionVisible.value) {
                return contentStyle.value ? (
                    <div style={contentStyle.value} /> 
                ) : (
                    <Content />
                );
            }
            return null;
        };

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
                        {renderContentCopy()}
                        <Transition name={transitionName.value}>
                            <Content
                                ref={contentRef}
                                v-show={transitionVisible.value}
                            />
                        </Transition>
                    </div>
                </LazyTeleport>
            </Fragment>
        );
    },
});
