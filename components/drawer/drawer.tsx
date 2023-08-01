import {
    computed,
    defineComponent,
    Teleport,
    Transition,
    ref,
    watch,
    nextTick,
    PropType,
    Component,
    CSSProperties,
    reactive,
} from 'vue';
import { isNumber } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import FButton from '../button';
import FScrollbar from '../scrollbar';
import { CloseOutlined } from '../icon';
import PopupManager from '../_util/popupManager';
import useLockScreen from '../_util/use/useLockScreen';
import { useConfig } from '../config-provider';
import { useTheme } from '../_theme/useTheme';
import { useResizable } from './useResizable';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('drawer');
const UPDATE_SHOW_EVENT = 'update:show';
const OK_EVENT = 'ok';
const CANCEL_EVENT = 'cancel';
const AFTER_LEAVE_EVENT = 'after-leave';

// 通用的属性
export const drawerProps = {
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
        type: [String, Number] as PropType<string | number>,
        default: 520,
    },
    height: {
        type: [String, Number] as PropType<string | number>,
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
        type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
        default: 'right',
    },
    contentClass: String,
    resizable: {
        type: Boolean,
        default: false,
    },
} as const;

export type DrawerProps = ExtractPublicPropTypes<typeof drawerProps>;

const Drawer = defineComponent({
    name: 'FDrawer',
    props: drawerProps,
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

        function handleCancel(event: MouseEvent) {
            ctx.emit(UPDATE_SHOW_EVENT, false);
            ctx.emit(CANCEL_EVENT, event);
        }

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
                    {header}
                    {closeJsx}
                </div>
            );
        }

        function getFooter() {
            if (!props.footer) return null;
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
                        >
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

        const drawerSize = reactive({
            width: props.width,
            height: props.height,
        });

        const propsKey = computed(() => {
            return ['top', 'bottom'].includes(props.placement)
                ? 'height'
                : 'width';
        });

        const styles = computed(() => {
            const sty: CSSProperties = { width: '100%', height: '100%' };
            // 初始化的时候 数字直接拼px，如果是字符串直接应用，拖拽后数值覆盖
            sty[propsKey.value] = isNumber(drawerSize[propsKey.value])
                ? `${drawerSize[propsKey.value]}px`
                : drawerSize[propsKey.value];
            return sty;
        });

        const {
            onMouseenter,
            onMouseleave,
            onMousedown,
            drawerRef,
            dragClass,
        } = useResizable({
            propsKey: propsKey.value,
            placement: props.placement,
            drawerSize,
            resizable: props.resizable,
            prefixCls,
        });

        const showDom = computed(
            () =>
                (props.displayDirective === 'if' && visible.value) ||
                props.displayDirective === 'show',
        );

        // 监听宽高改变的时候，宽高要生效
        watch([() => props.height, () => props.width], () => {
            drawerSize.width = props.width;
            drawerSize.height = props.height;
        });

        return () => (
            <Teleport
                disabled={!getContainer.value?.()}
                to={getContainer.value?.()}
            >
                <div class={`${prefixCls} ${prefixCls}-${props.placement}`}>
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
                                    ref={drawerRef}
                                    style={styles.value}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {/* 拖拽的dom 颜色透明  */}
                                    {props.resizable && (
                                        <div
                                            class={dragClass.value}
                                            onMousedown={onMousedown}
                                            onMouseenter={onMouseenter}
                                            onMouseleave={onMouseleave}
                                        ></div>
                                    )}
                                    {getHeader()}
                                    <FScrollbar
                                        class={`${prefixCls}-body-wrapper`}
                                        containerClass={`${prefixCls}-body-container`}
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
    },
});

export default Drawer;
