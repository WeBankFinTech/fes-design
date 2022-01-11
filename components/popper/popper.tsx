import {
    h,
    ref,
    watch,
    nextTick,
    defineComponent,
    Fragment,
    Teleport,
    cloneVNode,
    computed,
    Transition,
} from 'vue';
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
        // 当visible发生变化时 -> 动画 -> 计算placement，这样可能存在动画方向跟placement不一致，则设计了transitionVisible
        const transitionVisible = ref(visible.value);
        watch(visible, (val, oldVal) => {
            if (!oldVal) {
                nextTick(() => {
                    transitionVisible.value = val;
                });
            } else {
                transitionVisible.value = val;
            }
        });

        const copyRef = ref();

        const containerStyleRef = ref(null);

        watch(copyRef, () => {
            if (copyRef.value) {
                containerStyleRef.value = {
                    width: copyRef.value.offsetWidth + 'px',
                    height: copyRef.value.offsetHeight + 'px',
                };
            }
        });

        const renderTrigger = () => {
            const vNode = getFirstValidNode(slots.trigger!?.(), 1);
            if (vNode) {
                return cloneVNode(vNode, { ref: triggerRef, ...events }, true);
            }
        };

        const renderCopy = () => {
            if (visible.value && !transitionVisible.value) {
                if (!containerStyleRef.value) {
                    return (
                        <div ref={copyRef} class={popperClass.value}>
                            {slots.default?.()}
                        </div>
                    );
                }
                return <div style={containerStyleRef.value} />;
            }
            return null;
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
                        style={popperStyle}
                        role={'tooltip'}
                        onMouseenter={onPopperMouseEnter}
                        onMouseleave={onPopperMouseLeave}
                    >
                        {renderCopy()}
                        <Transition name={transitionName.value}>
                            <div
                                class={popperClass.value}
                                v-show={transitionVisible.value}
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
                        </Transition>
                    </div>
                </Teleport>
            </Fragment>
        );
    },
});
