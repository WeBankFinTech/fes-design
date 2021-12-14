import { computed, defineComponent, Teleport, Transition, ref, watch, nextTick } from 'vue';
import { isNumber } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import FButton from '../button';
import { CloseOutlined } from '../icon';
import PopupManager from '../_util/popupManager';
import useLockScreen from '../_util/use/useLockScreen';
import ConfigProvider from '../config-provider';

const prefixCls = getPrefixCls('drawer');
const UPDATE_SHOW_EVENT = 'update:show';
const OK_EVENT = 'ok';
const CANCEL_EVENT = 'cancel';
const AFTER_LEAVE_EVENT = 'after-leave';

// 通用的属性
const drawerProps = {
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
    height: {
        type: [String, Number],
        default: 520,
    },
    footer: {
        type: Boolean,
        default: false,
    },
    getContainer: {
        type: Function,
    },
    placement: {
        type: String,
        default: 'right',
        validator(value) {
            return ['top', 'right', 'bottom', 'left'].includes(value);
        },
    },
    contentClass: String,
};

/**
 * @type { ModalApi | import('vue').DefineComponent  }
 */
const Drawer = defineComponent({
    name: 'FDrawer',
    components: { FButton, CloseOutlined },
    props: { ...drawerProps },
    emits: [UPDATE_SHOW_EVENT, OK_EVENT, CANCEL_EVENT, AFTER_LEAVE_EVENT],
    setup(props, ctx) {
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
        const config = ConfigProvider.getConfig();
        const getContainer = computed(() => props.getContainer || config.getContainer);

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
            return <div class={`${prefixCls}-header`}>{header}</div>;
        }

        function getFooter() {
            if (!props.footer) return null;
            let footer = null;
            if (ctx.slots.footer) {
                footer = ctx.slots.footer();
            } else {
                footer = (
                    <>
                        <FButton type="primary" class="btn-margin" size="middle" onClick={handleOk}>
                            {props.okText}
                        </FButton>
                        <FButton size="middle" onClick={handleCancel}>
                            {props.cancelText}
                        </FButton>
                    </>
                );
            }
            return <div class={`${prefixCls}-footer`}>{footer}</div>;
        }

        const styles = computed(() => {
            const sty = { width: '100%', height: '100%' };
            const propsKey = ['top', 'bottom'].includes(props.placement) ? 'height' : 'width';
            sty[propsKey] = isNumber(props[propsKey]) ? `${props[propsKey]}px` : props[propsKey];
            return sty;
        });

        const showDom = computed(() => (props.displayDirective === 'if' && visible.value) || props.displayDirective === 'show');

        return () => (
            <Teleport to={getContainer.value?.()}>
                <div class={`${prefixCls} ${prefixCls}-${props.placement}`}>
                    <Transition name={`${prefixCls}-mask-fade`}>
                        {props.mask && showDom.value && <div class={`${prefixCls}-mask`} style={{ zIndex: zIndex.value }} v-show={visible.value}></div>}
                    </Transition>
                    <Transition name={`${prefixCls}-fade`} onAfterLeave={handleTransitionAfterLeave}>
                        {showDom.value && (
                            <div
                                v-show={visible.value}
                                class={{
                                    [`${prefixCls}-container`]: true,
                                    [`${prefixCls}-no-header`]: !hasHeader.value,
                                    [`${prefixCls}-no-footer`]: !props.footer,
                                }}
                                style={{ zIndex: zIndex.value }}
                                onClick={(event) => props.maskClosable && props.mask && handleCancel(event)}
                            >
                                <div
                                    class={`${prefixCls}-wrapper ${props.contentClass || ''}`}
                                    style={styles.value}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {getHeader()}
                                    <div class={`${prefixCls}-body`}>{ctx.slots.default?.()}</div>
                                    {getFooter()}
                                    {props.closable && (
                                        <div class={`${prefixCls}-close`} onClick={handleCancel}>
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

export default Drawer;
