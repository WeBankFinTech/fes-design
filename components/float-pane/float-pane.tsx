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
import { getPrefixStorage, getStorage } from '../_util/storage';

import PopupManager from '../_util/popupManager';
import { floatPaneProps } from './props';
import { useDrag } from './useDrag';

const prefixCls = getPrefixCls('float-pane');
const UPDATE_VISIBLE_EVENT = 'update:visible';
const AFTER_ENTER_EVENT = 'after-enter';
const AFTER_LEAVE_EVENT = 'after-leave';

const FloatPane = defineComponent({
    name: 'FFloatPane',
    props: floatPaneProps,
    emits: [
        UPDATE_VISIBLE_EVENT,
        AFTER_ENTER_EVENT,
        AFTER_LEAVE_EVENT,
    ],
    setup(props, ctx) {
        useTheme();
        const innerVisible = ref(false);
        const domRef = ref<HTMLElement>(null);
        const domHeaderRef = ref<HTMLElement>(null);

        const zIndex = ref(props.zIndex || PopupManager.nextZIndex());

        watch(
            () => props.visible,
            () => {
                if (props.visible) {
                    zIndex.value = props.zIndex || PopupManager.nextZIndex();
                }

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
            innerVisible.value = false;
            ctx.emit(UPDATE_VISIBLE_EVENT, false);
        }

        function handleTransitionAfterEnter(el: Element) {
            ctx.emit(AFTER_ENTER_EVENT, el);
        }
        function handleTransitionAfterLeave(el: Element) {
            ctx.emit(AFTER_LEAVE_EVENT, el);
        }

        const hasHeader = () => ctx.slots.title || props.title;

        const transform = props.cachePosition
            ? useStorage<{
                offsetX: number;
                offsetY: number;
            }>(getPrefixStorage(props.cachePositionKey || 'float-pane'), {
                offsetX: 0,
                offsetY: 0,
            }, getStorage(props.cachePosition))
            : ref({
                offsetX: 0,
                offsetY: 0,
            });
        const styles = computed(() => {
            const { offsetX, offsetY }
            = transform.value;
            return {
                zIndex: zIndex.value,
                width: isNumber(props.width) ? `${props.width}px` : props.width,
                ...props.defaultPosition,
                transform: `translate(${offsetX}px, ${offsetY}px)`,
            };
        });

        const { handleMouseDown, isDragging } = useDrag(transform, domRef, domHeaderRef, getContainer, props.defaultPosition);
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
            if (!hasHeader()) {
                return closeJsx;
            }
            const header = ctx.slots.title?.() || props.title;
            return (
                <div ref={domHeaderRef} class={[`${prefixCls}-header`, isDragging.value && `${prefixCls}-header--dragging`]} onMousedown={handleDraggable}>
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

        ctx.expose({
            show() {
                innerVisible.value = true;
            },
            hide() {
                innerVisible.value = false;
            },
            resetPosition() {
                transform.value = {
                    offsetX: 0,
                    offsetY: 0,
                };
            },
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
                                ref={domRef}
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

export default FloatPane;
