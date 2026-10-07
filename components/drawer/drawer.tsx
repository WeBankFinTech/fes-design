import {
    type CSSProperties,
    type Component,
    Teleport,
    Transition,
    computed,
    defineComponent,
    nextTick,
    ref,
    useId,
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
import useFocusTrap from '../_util/use/useFocusTrap';
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
        watch(
            () => props.show,
            () => {
                if (props.show) {
                    zIndex.value = PopupManager.nextZIndex();
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

        // 传入 visible：仅在弹窗打开期间监听 Esc，多弹窗不再同时响应
        useEsc(handleCancel, escClosable, visible);

        // 无障碍：标题 id 与焦点管理（初始聚焦/Tab 圈闭/焦点归还）
        const titleId = useId();
        const containerRef = ref<HTMLElement | null>(null);
        useFocusTrap(containerRef as any, visible);

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
                <div
                    class={`${prefixCls}-close`}
                    role="button"
                    aria-label={t('drawer.close')}
                    onClick={handleCancel}
                >
                    <CloseOutlined />
                </div>
            );
            if (!hasHeader()) {
                return closeJsx;
            }
            const header = ctx.slots.title?.() || props.title;
            return (
                <div class={`${prefixCls}-header`} id={titleId}>
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
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby={hasHeader() ? titleId : undefined}
                                    tabindex="-1"
                                    ref={(el: any) => {
                                        containerRef.value = el;
                                        drawerRef.value = el;
                                    }}
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
    },
});

export default Drawer;
