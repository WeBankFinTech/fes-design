import {
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
import getPrefixCls from '../_util/getPrefixCls';
import { FScrollbar } from '../scrollbar';
import FButton from '../button/button';
import { CloseOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import useEsc from '../_util/use/useEsc';
import PopupManager from '../_util/popupManager';
import useLockScreen from '../_util/use/useLockScreen';
import { useConfig } from '../config-provider';
import { useLocale } from '../config-provider/useLocale';
import { useContentMaxHeight } from './useContentMaxHeight';
import { globalModalProps, modalIconMap, modalProps } from './props';

const prefixCls = getPrefixCls('modal');
const UPDATE_SHOW_EVENT = 'update:show';
const OK_EVENT = 'ok';
const CANCEL_EVENT = 'cancel';
const AFTER_ENTER_EVENT = 'after-enter';
const AFTER_LEAVE_EVENT = 'after-leave';

const Modal = defineComponent({
    name: 'FModal',
    props: { ...globalModalProps, ...modalProps },
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
                <div class={`${prefixCls}-header`} ref={modalHeaderRef}>
                    {props.type && (
                        <div
                            class={`${prefixCls}-icon ${prefixCls}-status-${props.type}`}
                        >
                            {props.type && modalIconMap[props.type]()}
                        </div>
                    )}
                    <div>{header}</div>
                    {closeJsx}
                </div>
            );
        }

        function getFooter() {
            if (!props.footer) {
                return null;
            }
            let footer = null;
            if (ctx.slots.footer) {
                footer = ctx.slots.footer();
            } else {
                footer = (
                    <>
                        {props.showCancel && (
                            <FButton
                                size="middle"
                                class="btn-margin"
                                onClick={handleCancel}
                                loading={props.cancelLoading}
                            >
                                {props.cancelText || t('modal.cancelText')}
                            </FButton>
                        )}
                        <FButton
                            type="primary"
                            size="middle"
                            onClick={handleOk}
                            loading={props.okLoading}
                        >
                            {props.okText || t('modal.okText')}
                        </FButton>
                    </>
                );
            }
            return (
                <div class={`${prefixCls}-footer`} ref={modalFooterRef}>
                    {footer}
                </div>
            );
        }

        const styles = computed(() => {
            if (props.fullScreen) {
                return {};
            }
            return {
                width: isNumber(props.width) ? `${props.width}px` : props.width,
                marginTop: props.verticalCenter
                    ? 0
                    : isNumber(props.top)
                        ? `${props.top}px`
                        : props.top,
                marginBottom: props.verticalCenter
                    ? 0
                    : isNumber(props.bottom)
                        ? `${props.bottom}px`
                        : props.bottom,
            };
        });

        // 获取最大的内容高度
        const {
            modalRef,
            modalHeaderRef,
            modalFooterRef,
            contentMaxHeight,
            hasMaxHeight,
        } = useContentMaxHeight(styles, props);

        const getBody = () => {
            const modalBody = (
                <div class={`${prefixCls}-body`}>
                    {ctx.slots.default
                        ? ctx.slots.default()
                        : props.forGlobal && props.content}
                </div>
            );
            if (hasMaxHeight.value) {
                return (
                    <FScrollbar
                        maxHeight={contentMaxHeight.value}
                        shadow={true}
                    >
                        {modalBody}
                    </FScrollbar>
                );
            }
            return modalBody;
        };

        const showDom = computed(
            () =>
                (props.displayDirective === 'if' && visible.value)
                || props.displayDirective === 'show',
        );

        // 鼠标在弹窗内按下
        const mouseDownInsideChild = ref(false);

        // 遮罩层点击关闭的逻辑
        const handleClickMask = (event: MouseEvent) => {
            if (
                props.maskClosable
                && props.mask
                && !mouseDownInsideChild.value
            ) {
                handleCancel(event);
            }
            mouseDownInsideChild.value = false;
        };

        // 最外层类名
        const rootClass = computed(() => {
            return [prefixCls, props.wrapperClass].filter(Boolean);
        });

        const wrapperClass = computed(() => {
            return [`${prefixCls}-wrapper`, props.contentClass].filter(Boolean);
        });

        const renderMask = () => {
            return (
                <div
                    class={`${prefixCls}-mask`}
                    style={{ zIndex: zIndex.value }}
                    v-show={visible.value}
                ></div>
            );
        };

        const renderContent = () => {
            return (
                <div
                    v-show={visible.value}
                    class={{
                        [`${prefixCls}-container`]: true,
                        [`${prefixCls}-center`]: props.center,
                        [`${prefixCls}-vertical-center`]:
                                        props.verticalCenter,
                        [`${prefixCls}-fullscreen`]:
                                        props.fullScreen,
                        [`${prefixCls}-global`]: props.forGlobal,
                        [`${prefixCls}-no-header`]:
                                        !hasHeader(),
                        [`${prefixCls}-no-footer`]: !props.footer,
                    }}
                    style={{ zIndex: zIndex.value }}
                    onClick={(event) => handleClickMask(event)}
                >
                    <div
                        class={wrapperClass.value}
                        style={styles.value}
                        onClick={(event) => event.stopPropagation()}
                        onMousedown={() => {
                            mouseDownInsideChild.value = true;
                        }}
                        onMouseup={() => {
                            mouseDownInsideChild.value = false;
                        }}
                        ref={modalRef}
                    >
                        {getHeader()}
                        {getBody()}
                        {getFooter()}
                    </div>
                </div>
            );
        };

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
                    {
                        props.useAnimation
                            ? (
                                <>
                                    <Transition name={`${prefixCls}-mask-fade`}>
                                        {props.mask && showDom.value && renderMask()}
                                    </Transition>
                                    <Transition
                                        name={`${prefixCls}-fade`}
                                        onAfterEnter={handleTransitionAfterEnter}
                                        onAfterLeave={handleTransitionAfterLeave}
                                    >
                                        {showDom.value && renderContent()}
                                    </Transition>
                                </>
                                )
                            : (
                                <>
                                    {props.mask && showDom.value && renderMask()}
                                    {showDom.value && renderContent()}
                                </>
                                )
                    }
                </div>
            </Teleport>
            );
        };
    },
});

export default Modal;
