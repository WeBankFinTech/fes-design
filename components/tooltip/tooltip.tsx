import {
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    ref,
} from 'vue';
import { isNil } from 'lodash-es';
import { useVModel } from '@vueuse/core';
import Popper from '../popper/popper';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import ExclamationCircleFilled from '../icon/ExclamationCircleFilled';
import FButton from '../button/button';
import { popperProps } from '../popper/props';
import { CANCEL_EVENT, OK_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { useLocale } from '../config-provider/useLocale';

const prefixCls = getPrefixCls('tooltip');

const defaultConfirmOption = {
    okText: '',
    cancelText: '',
    showOk: true,
    showCancel: true,
    icon: <ExclamationCircleFilled />,
};

export const toolTipProps = {
    ...popperProps,
    title: [Number, String] as PropType<number | string>,
    content: [Number, String] as PropType<number | string>,
    mode: {
        type: String as PropType<'text' | 'confirm' | 'popover'>,
        default: 'text',
    },
    confirmOption: {
        type: Object,
        default: () => defaultConfirmOption,
    },
    arrow: {
        type: Boolean,
        default: true,
    },
    offset: {
        type: Number,
        default: 8,
    },
} as const satisfies ComponentObjectPropsOptions;

export type ToolTipProps = ExtractPublicPropTypes<typeof toolTipProps>;

export default defineComponent({
    name: 'FTooltip',
    props: toolTipProps,
    emits: [OK_EVENT, CANCEL_EVENT, UPDATE_MODEL_EVENT, 'clickOutside'],
    setup(props, ctx) {
        useTheme();

        const currentValue = useVModel(props, 'modelValue', ctx.emit, {
            passive: props.passive,
        });
        const updateCurrentValue = (val: boolean) => {
            currentValue.value = val;
        };

        const { t } = useLocale();

        const popperElRef = ref(null);

        function getPopperSlots() {
            return {
                trigger: ctx.slots.default,
            };
        }

        function handleConfirmCB(
            name: typeof OK_EVENT | typeof CANCEL_EVENT,
            event: MouseEvent,
        ) {
            updateCurrentValue(false);
            ctx.emit(name, event);
        }

        function renderContent() {
            const content = ctx.slots?.content?.() ?? props.content;
            const title = ctx.slots?.title?.() ?? props.title;
            const isConfirm = props.mode === 'confirm';
            const isPopover = props.mode === 'popover';
            if (props.mode === 'text') {
                return content;
            }
            if (isConfirm || isPopover) {
                const mergeOpt = {
                    ...defaultConfirmOption,
                    ...props.confirmOption,
                };
                const contentClass = [
                    `${prefixCls}-modal-body`,
                    isConfirm && 'is-confirm',
                    title && 'has-header',
                ]
                    .filter(Boolean)
                    .join(' ');
                return (
                    <>
                        {title && (
                            <div
                                class={`${prefixCls}-modal-header ${
                                    isConfirm && 'is-confirm'
                                }`}
                            >
                                {isConfirm && (
                                    <div class={`${prefixCls}-modal-icon`}>
                                        {mergeOpt.icon}
                                    </div>
                                )}
                                {title}
                            </div>
                        )}
                        {!isNil(content)
                            ? (
                                <div class={contentClass}>{content}</div>
                                )
                            : (
                                    content
                                )}
                        {isConfirm && (
                            <>
                                {mergeOpt.showOk && (
                                    <FButton
                                        class={`${prefixCls}-modal-btn`}
                                        onClick={(event) =>
                                            handleConfirmCB(OK_EVENT, event)
                                    }
                                        size="small"
                                        type="primary"
                                    >
                                        {mergeOpt.okText || t('tooltip.okText')}
                                    </FButton>
                                )}
                                {
                                    mergeOpt.showCancel && (
                                        <FButton
                                            class={`${prefixCls}-modal-btn`}
                                            onClick={(event) =>
                                                handleConfirmCB(CANCEL_EVENT, event)
                                    }
                                            size="small"
                                        >
                                            {mergeOpt.cancelText || t('tooltip.cancelText')}
                                        </FButton>
                                    )
                                }

                            </>
                        )}
                    </>
                );
            }
        }

        const popperPropsRef = computed(() => {
            const _props: Record<string, any> = {};
            Object.keys(popperProps).forEach((key) => {
                _props[key] = props[key as keyof typeof props];
            });
            if (props.mode === 'confirm') {
                // confirm模式下，只能点击触发
                _props.trigger = 'click';
            }
            return _props;
        });

        ctx.expose({
            updatePopperPosition() {
                popperElRef.value?.updatePopperPosition();
            },
        });

        return () => {
            return (
                <Popper
                    {...popperPropsRef.value}
                    v-model={currentValue.value}
                    ref={popperElRef}
                    popperClass={[
                        prefixCls,
                        `${prefixCls}-${props.mode}`,
                        popperPropsRef.value.popperClass,
                    ]}
                    v-slots={getPopperSlots()}
                    onClickOutside={() => ctx.emit('clickOutside')}
                >
                    {renderContent()}
                </Popper>
            );
        };
    },
});
