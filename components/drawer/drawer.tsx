import {
    computed,
    defineComponent,
    Teleport,
    Transition,
    ref,
    watch,
    nextTick,
    type Component,
    type CSSProperties,
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
import { useResizable } from './useResizable';
import { COMPONENT_NAME, prefixCls } from './const';
import {
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

        function handleCancel(event: MouseEvent | KeyboardEvent) {
            ctx.emit(UPDATE_SHOW_EVENT, false);
            ctx.emit(CANCEL_EVENT, event);
        }

        const escClosable = computed(() => props.escClosable);

        useEsc(handleCancel, escClosable);

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
                            loading={props.okLoading}
                        >
                            {props.okText}
                        </FButton>
                        {props.showCancel && (
                            <FButton size="middle" onClick={handleCancel}>
                                {props.cancelText}
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
                (props.displayDirective === 'if' && visible.value) ||
                props.displayDirective === 'show',
        );

        const wrapperClass = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                props.contentClass,
                props.wrapperClass,
            ].filter(Boolean);
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
                                    // 没有蒙层时，该属性才生效
                                    [`${prefixCls}-operable`]:
                                        !props.mask && props.operable,
                                    [`${prefixCls}-mask-closable`]:
                                        props.mask && props.maskClosable,
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
    },
});

export default Drawer;
