import {
    computed,
    defineComponent,
    Teleport,
    Transition,
    ref,
    watch,
    nextTick,
    PropType,
    VNode,
    VNodeChild,
} from 'vue';
import { isNumber } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import FButton from '../button/button';
import { CloseOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import useEsc from '../_util/use/useEsc';
import { iconComponentMap } from '../_util/noticeManager';
import PopupManager from '../_util/popupManager';
import useLockScreen from '../_util/use/useLockScreen';
import { useConfig } from '../config-provider';
import { useLocale } from '../config-provider/useLocale';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('modal');
const UPDATE_SHOW_EVENT = 'update:show';
const OK_EVENT = 'ok';
const CANCEL_EVENT = 'cancel';
const AFTER_LEAVE_EVENT = 'after-leave';
const modalIconMap = {
    ...iconComponentMap,
    confirm: iconComponentMap.warning,
} as const;

export type ModalType = keyof typeof modalIconMap;

// 全局方法的特有属性
const globalModalProps = {
    type: {
        type: String as PropType<ModalType>,
        default: 'info',
    },
    content: String as PropType<string | VNode | (() => VNodeChild)>,
    forGlobal: Boolean,
} as const;

// 通用的属性
export const modalProps = {
    show: Boolean,
    displayDirective: {
        type: String as PropType<'show' | 'if'>,
        default: 'show',
    },
    closable: {
        type: Boolean,
        default: true,
    },
    mask: {
        type: Boolean,
        default: true,
    },
    maskClosable: {
        type: Boolean,
        default: true,
    },
    title: String as PropType<string | VNode | (() => VNodeChild)>,
    okText: String,
    cancelText: String,
    width: {
        type: [String, Number] as PropType<string | number>,
        default: 520,
    },
    top: {
        type: [String, Number] as PropType<string | number>,
        default: 50,
    },
    verticalCenter: Boolean,
    center: Boolean,
    footer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function as PropType<() => HTMLElement>,
    },
    fullScreen: {
        type: Boolean,
        default: false,
    },
    contentClass: String,
} as const;

export type ModalProps = ExtractPublicPropTypes<typeof modalProps>;

const Modal = defineComponent({
    name: 'FModal',
    props: { ...globalModalProps, ...modalProps },
    emits: [UPDATE_SHOW_EVENT, OK_EVENT, CANCEL_EVENT, AFTER_LEAVE_EVENT],
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

        useEsc(handleCancel);

        function handleOk(event: MouseEvent) {
            ctx.emit(OK_EVENT, event);
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
                <div class={`${prefixCls}-header`}>
                    {props.forGlobal && (
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
                        {(!props.forGlobal || props.type === 'confirm') && (
                            <FButton
                                size="middle"
                                class="btn-margin"
                                onClick={handleCancel}
                            >
                                {props.cancelText || t('modal.cancelText')}
                            </FButton>
                        )}
                        <FButton
                            type="primary"
                            size="middle"
                            onClick={handleOk}
                        >
                            {props.okText || t('modal.okText')}
                        </FButton>
                    </>
                );
            }
            return <div class={`${prefixCls}-footer`}>{footer}</div>;
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
            };
        });

        const showDom = computed(
            () =>
                (props.displayDirective === 'if' && visible.value) ||
                props.displayDirective === 'show',
        );

        return () => (
            <Teleport
                disabled={!getContainer.value?.()}
                to={getContainer.value?.()}
            >
                <div class={`${prefixCls}`}>
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
                                onClick={(event) =>
                                    props.maskClosable &&
                                    props.mask &&
                                    handleCancel(event)
                                }
                            >
                                <div
                                    class={`${prefixCls}-wrapper ${
                                        props.contentClass || ''
                                    }`}
                                    style={styles.value}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {getHeader()}
                                    <div class={`${prefixCls}-body`}>
                                        {ctx.slots.default
                                            ? ctx.slots.default()
                                            : props.forGlobal && props.content}
                                    </div>
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
