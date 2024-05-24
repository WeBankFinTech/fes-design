import {
    Teleport,
    Transition,
    computed,
    defineComponent,
    nextTick,
    ref,
    watch,
} from 'vue';
import { isNumber } from 'lodash-es';
import { useStorage } from '@vueuse/core';
import getPrefixCls from '../_util/getPrefixCls';
import { CloseOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import { useConfig } from '../config-provider';
import getPrefixStorage from '../_util/getPrefixStorage';
import { floatingPaneProps } from './props';
import { useDrag } from './useDrag';

const prefixCls = getPrefixCls('floating-pane');
const UPDATE_VISIBLE_EVENT = 'update:visible';
const AFTER_ENTER_EVENT = 'after-enter';
const AFTER_LEAVE_EVENT = 'after-leave';

const FloatingPane = defineComponent({
    name: 'FFloatingPane',
    props: floatingPaneProps,
    emits: [
        UPDATE_VISIBLE_EVENT,
        AFTER_ENTER_EVENT,
        AFTER_LEAVE_EVENT,
    ],
    setup(props, ctx) {
        useTheme();
        const innerVisible = ref(false);

        console.log(props.cachePrePosition);
        watch(
            () => props.visible,
            () => {
                nextTick(() => {
                    innerVisible.value = props.visible;
                });
            },
            { immediate: true },
        );
        const config = useConfig();
        const getContainer = computed(
            () => props.getContainer || config.getContainer?.value,
        );

        function handleCancel() {
            ctx.emit(UPDATE_VISIBLE_EVENT, false);
        }

        function handleTransitionAfterEnter(el: Element) {
            ctx.emit(AFTER_ENTER_EVENT, el);
        }
        function handleTransitionAfterLeave(el: Element) {
            ctx.emit(AFTER_LEAVE_EVENT, el);
        }

        const hasHeader = computed(() => ctx.slots.title || props.title);

        const transform = props.cachePrePosition
            ? useStorage<{
                offsetX: number;
                offsetY: number;
            }>(getPrefixStorage('floating-pane'), {
                offsetX: 0,
                offsetY: 0,
            }, window[props.cachePrePosition])
            : ref({
                offsetX: 0,
                offsetY: 0,
            });
        const styles = computed(() => {
            const { offsetX, offsetY }
            = transform.value;
            return {
                zIndex: props.zIndex,
                width: isNumber(props.width) ? `${props.width}px` : props.width,
                ...props.defaultPosition,
                transform: `translate(${offsetX}px, ${offsetY}px)`,
            };
        });

        const { handleMouseDown } = useDrag(transform);
        const handleDraggable = (event: MouseEvent) => {
            if (props.draggable) {
                handleMouseDown(event);
            }
        };

        function getHeader() {
            const closeJsx = (
                <div class={`${prefixCls}-close`} onClick={handleCancel}>
                    <CloseOutlined />
                </div>
            );
            if (!hasHeader.value) {
                return closeJsx;
            }
            const header = ctx.slots.title?.() || props.title;
            return (
                <div class={`${prefixCls}-header`} onMousedown={handleDraggable}>
                    <div>{header}</div>
                    {closeJsx}
                </div>
            );
        }

        const getBody = () => {
            return (
                <div class={`${prefixCls}-body`}>
                    {ctx.slots.default?.()}
                </div>
            );
        };

        const showDom = computed(
            () =>
                (props.displayDirective === 'if' && innerVisible.value)
                || props.displayDirective === 'show',
        );

        const wrapperClass = computed(() => {
            return [`${prefixCls}-container`, props.contentClass].filter(Boolean);
        });

        return () => (
            <Teleport
                disabled={!getContainer.value?.()}
                to={getContainer.value?.()}
            >
                <div class={prefixCls}>
                    <Transition
                        name={`${prefixCls}-fade`}
                        onAfterEnter={handleTransitionAfterEnter}
                        onAfterLeave={handleTransitionAfterLeave}
                    >
                        {showDom.value && (
                            <div
                                v-show={innerVisible.value}
                                class={wrapperClass.value}
                                style={styles.value}
                            >
                                {getHeader()}
                                {getBody()}
                            </div>
                        )}
                    </Transition>
                </div>
            </Teleport>
        );
    },
});

export default FloatingPane;
