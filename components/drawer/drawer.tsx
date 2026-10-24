import {
    type CSSProperties,
    type Component,
    Teleport,
    Transition,
    computed,
    defineComponent,
    nextTick,
    onMounted,
    ref,
    watch,
} from 'vue';
import { isNumber } from 'lodash-es';
import FButton from '../button';
import FScrollbar from '../scrollbar';
import { CloseOutlined } from '../icon';
import PopupManager from '../_util/popupManager';
import useLockScreen from '../_util/use/useLockScreen';
import { useConfig } from '../config-provider';
import { useTheme } from '../_theme/useTheme';
import { pxfy } from '../_util/utils';
import useEsc from '../_util/use/useEsc';
import { useLocale } from '../config-provider/useLocale';
import { useResizable } from './useResizable';
import { COMPONENT_NAME, prefixCls } from './const';
import {
    AFTER_ENTER_EVENT,
    AFTER_LEAVE_EVENT,
    CANCEL_EVENT,
    OK_EVENT,
    UPDATE_SHOW_EVENT,
    drawerProps,
} from './props';
import { useDrawerDimension } from './useDimension';

const Drawer = defineComponent({
    name: COMPONENT_NAME,
    props: drawerProps,
    emits: [
        UPDATE_SHOW_EVENT,
        OK_EVENT,
        CANCEL_EVENT,
        AFTER_ENTER_EVENT,
        AFTER_LEAVE_EVENT,
    ],
    setup(props, ctx) {
        useTheme();
        const zIndex = ref(PopupManager.nextZIndex());
        const visible = ref(false);
        useLockScreen(visible);
        // Teleport 挂载后才激活（见 render 注释），保证 SSR 与水合首帧
        // 的 DOM 结构对称
        const teleportReady = ref(false);
        onMounted(() => {
            teleportReady.value = true;
        });
        // 首帧同步置值（含 SSR）：nextTick 推迟会在服务端单趟渲染下
        // 输出空内容（visible 永远为 false）。首帧本无过渡动画，
        // 同步置值无视觉损失；后续切换仍走 nextTick 保证动画时序
        let isFirstRender = true;
        watch(
            () => props.show,
            () => {
                if (props.show) {
                    zIndex.value = PopupManager.nextZIndex();
                }

                if (isFirstRender) {
                    visible.value = props.show;
                    isFirstRender = false;
                    return;
                }

                nextTick(() => {
                    visible.value = props.show;
                });
            },
            { immediate: true },
        );
        const config = useConfig();
        const getContainer = computed(
            () => props.getContainer || config.getContainer?.value,
        );

        const { t } = useLocale();

        function handleCancel(event: MouseEvent | KeyboardEvent) {
            ctx.emit(UPDATE_SHOW_EVENT, false);
            ctx.emit(CANCEL_EVENT, event);
        }

        const escClosable = computed(() => props.escClosable);

        useEsc(handleCancel, escClosable);

        function handleOk(event: MouseEvent) {
            ctx.emit(OK_EVENT, event);
        }

        function handleTransitionAfterEnter(el: Element) {
            ctx.emit(AFTER_ENTER_EVENT, el);
        }
        function handleTransitionAfterLeave(el: Element) {
            ctx.emit(AFTER_LEAVE_EVENT, el);
        }

        const hasHeader = () => ctx.slots.title || props.title;

        function getHeader() {
            const closeJsx = props.closable && (
                <div class={`${prefixCls}-close`} onClick={handleCancel}>
                    <CloseOutlined />
                </div>
            );
            if (!hasHeader()) {
                return closeJsx;
            }
            const header = ctx.slots.title?.() || props.title;
            return (
                <div class={`${prefixCls}-header`}>
                    {header}
                    {closeJsx}
                </div>
            );
        }

        function getFooter() {
            if (!props.footer) {
                return null;
            }
            let footer: Component;
            if (ctx.slots.footer) {
                footer = ctx.slots.footer();
            } else {
                footer = (
                    <>
                        <FButton
                            type="primary"
                            class="btn-margin"
                            size="middle"
                            onClick={handleOk}
                            loading={props.okLoading}
                        >
                            {props.okText || t('drawer.okText')}
                        </FButton>
                        {props.showCancel && (
                            <FButton size="middle" onClick={handleCancel}>
                                {props.cancelText || t('drawer.cancelText')}
                            </FButton>
                        )}
                    </>
                );
            }
            return (
                <div
                    class={{
                        [`${prefixCls}-footer`]: true,
                        [`${prefixCls}-footer-has-border`]: props.footerBorder,
                    }}
                >
                    {footer}
                </div>
            );
        }

        const drawerDimension = useDrawerDimension(props);

        const styles = computed(() => {
            const sizeStyle: CSSProperties = { width: '100%', height: '100%' };

            const dimensionKey = ['top', 'bottom'].includes(props.placement)
                ? 'height'
                : 'width';
            sizeStyle[dimensionKey] = isNumber(drawerDimension.value)
                ? pxfy(drawerDimension.value)
                : drawerDimension.value;

            return sizeStyle;
        });

        const { onMousedown, drawerRef, dragClass } = useResizable({
            props,
            drawerDimension,
        });

        const showDom = computed(
            () =>
                (props.displayDirective === 'if' && visible.value)
                || props.displayDirective === 'show',
        );

        const wrapperClass = computed(() => {
            return [`${prefixCls}-wrapper`, props.contentClass].filter(Boolean);
        });

        const rootClass = computed(() => {
            return [
                prefixCls,
                `${prefixCls}-${props.placement}`,
                props.wrapperClass,
            ].filter(Boolean);
        });

        return () => {
            // Teleport 延迟激活（LazyTeleport 思路）：SSR 与水合首帧
            // 就地渲染（两端对称，避免水合不匹配；且 server-renderer
            // 对无 target 的 Teleport 会直接丢弃内容），挂载后激活
            // 传送，恢复正常挂载到 body 的行为。displayDirective 默认
            // 'show'（v-show 控制），首帧内容可见
            const container = getContainer.value?.();
            return (
                <Teleport
                    disabled={!container || !teleportReady.value}
                    to={container || 'body'}
                >
                <div class={rootClass.value}>
                    <Transition name={`${prefixCls}-mask-fade`}>
                        {props.mask && showDom.value && (
                            <div
                                class={`${prefixCls}-mask`}
                                style={{ zIndex: zIndex.value }}
                                v-show={visible.value}
                            ></div>
                        )}
                    </Transition>
                    <Transition
                        name={`${prefixCls}-fade`}
                        onAfterEnter={handleTransitionAfterEnter}
                        onAfterLeave={handleTransitionAfterLeave}
                    >
                        {showDom.value && (
                            <div
                                v-show={visible.value}
                                class={{
                                    [`${prefixCls}-container`]: true,
                                    // 没有蒙层时，该属性才生效
                                    [`${prefixCls}-operable`]:
                                        !props.mask && props.operable,
                                    [`${prefixCls}-mask-closable`]:
                                        props.mask && props.maskClosable,
                                    [`${prefixCls}-no-header`]:
                                        !hasHeader(),
                                    [`${prefixCls}-no-footer`]: !props.footer,
                                }}
                                style={{ zIndex: zIndex.value }}
                                onClick={(event) =>
                                    props.maskClosable
                                    && props.mask
                                    && handleCancel(event)
                                }
                            >
                                <div
                                    class={wrapperClass.value}
                                    ref={drawerRef}
                                    style={styles.value}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {/* 拖拽的dom 颜色透明  */}
                                    {props.resizable && (
                                        <div
                                            class={dragClass.value}
                                            onMousedown={onMousedown}
                                        >
                                            <div
                                                class={`${prefixCls}-drag-icon`}
                                            />
                                        </div>
                                    )}
                                    {getHeader()}
                                    <FScrollbar
                                        class={`${prefixCls}-body-wrapper`}
                                        containerClass={`${prefixCls}-body-container`}
                                        always={true}
                                    >
                                        {ctx.slots.default?.()}
                                    </FScrollbar>
                                    {getFooter()}
                                </div>
                            </div>
                        )}
                    </Transition>
                </div>
            </Teleport>
            );
        };
    },
});

export default Drawer;
