import {
    computed,
    defineComponent,
    Teleport,
    Transition,
    ref,
    watch,
    nextTick,
} from 'vue';
import { isNumber } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import FButton from '../button';
import { CloseOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import { iconComponentMap } from '../_util/noticeManager';
import PopupManager from '../_util/popupManager';
import useLockScreen from '../_util/use/useLockScreen';
import { getConfig } from '../config-provider';

const prefixCls = getPrefixCls('modal');
const UPDATE_SHOW_EVENT = 'update:show';
const OK_EVENT = 'ok';
const CANCEL_EVENT = 'cancel';
const AFTER_LEAVE_EVENT = 'after-leave';
const modalIconMap = {
    ...iconComponentMap,
    confirm: iconComponentMap.warning,
};

// 全局方法的特有属性
const globalModalProps = {
    type: {
        type: String,
        default: 'info',
        validator(value) {
            return Object.keys(modalIconMap).includes(value);
        },
    },
    content: String,
    forGlobal: Boolean,
};

// 通用的属性
const modalProps = {
    show: Boolean,
    displayDirective: {
        type: String,
        default: 'show',
        validator(value) {
            return ['show', 'if'].includes(value);
        },
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
    title: String,
    okText: {
        type: String,
        default: '确定',
    },
    cancelText: {
        type: String,
        default: '取消',
    },
    width: {
        type: [String, Number],
        default: 520,
    },
    top: {
        type: [String, Number],
        default: 50,
    },
    center: Boolean,
    footer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function,
    },
    fullScreen: {
        type: Boolean,
        default: false,
    },
    contentClass: String,
};

/**
 * @type { ModalApi | import('vue').DefineComponent  }
 */
const Modal = defineComponent({
    name: 'FModal',
    components: { ...Object.values(iconComponentMap), FButton, CloseOutlined },
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
        const config = getConfig();
        const getContainer = computed(
            () => props.getContainer || config.getContainer,
        );

        function handleCancel(event) {
            ctx.emit(UPDATE_SHOW_EVENT, false);
            ctx.emit(CANCEL_EVENT, event);
        }

        function handleOk(event) {
            ctx.emit(OK_EVENT, event);
        }

        function handleTransitionAfterLeave(event) {
            ctx.emit(AFTER_LEAVE_EVENT, event);
        }

        const hasHeader = computed(() => ctx.slots.title || props.title);

        function getHeader() {
            if (!hasHeader.value) return null;
            const header = ctx.slots.title?.() || props.title;
            const Icon = modalIconMap[props.type];
            return (
                <div class={`${prefixCls}-header`}>
                    {props.forGlobal && (
                        <div
                            class={`${prefixCls}-icon ${prefixCls}-status-${props.type}`}
                        >
                            {Icon && <Icon />}
                        </div>
                    )}
                    <div>{header}</div>
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
                                {props.cancelText}
                            </FButton>
                        )}
                        <FButton
                            type="primary"
                            size="middle"
                            onClick={handleOk}
                        >
                            {props.okText}
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
                marginTop: isNumber(props.top) ? `${props.top}px` : props.top,
            };
        });

        const showDom = computed(
            () =>
                (props.displayDirective === 'if' && visible.value) ||
                props.displayDirective === 'show',
        );

        return () => (
            <Teleport to={getContainer.value?.()}>
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
                                    {props.closable && (
                                        <div
                                            class={`${prefixCls}-close`}
                                            onClick={handleCancel}
                                        >
                                            <CloseOutlined />
                                        </div>
                                    )}
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
