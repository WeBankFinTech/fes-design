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
        watch(
            () => props.show,
            () => {
                if (props.show) zIndex.value = PopupManager.nextZIndex();

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

        const hasHeader = computed(() => ctx.slots.title || props.title);

        function getHeader() {
            const closeJsx = props.closable && (
                <div class={`${prefixCls}-close`} onClick={handleCancel}>
                    <CloseOutlined />
                </div>
            );
            if (!hasHeader.value) return closeJsx;
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
            if (!props.footer) return null;
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
            if (props.fullScreen) return {};
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

        return () => (
            <Teleport
                disabled={!getContainer.value?.()}
                to={getContainer.value?.()}
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
                                    [`${prefixCls}-center`]: props.center,
                                    [`${prefixCls}-vertical-center`]:
                                        props.verticalCenter,
                                    [`${prefixCls}-fullscreen`]:
                                        props.fullScreen,
                                    [`${prefixCls}-global`]: props.forGlobal,
                                    [`${prefixCls}-no-header`]:
                                        !hasHeader.value,
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
                        )}
                    </Transition>
                </div>
            </Teleport>
        );
    },
});

export default Modal;
