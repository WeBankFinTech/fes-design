import { h, Fragment, defineComponent, PropType } from 'vue';
import Popper from '../popper/popper';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import ExclamationCircleFilled from '../icon/ExclamationCircleFilled';
import FButton from '../button/button';
import { useNormalModel } from '../_util/use/useModel';
import { popperProps } from '../popper/props';
import { CANCEL_EVENT, OK_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';

const prefixCls = getPrefixCls('tooltip');

const defaultConfirmOption = {
    okText: '确定',
    cancelText: '取消',
    icon: <ExclamationCircleFilled />,
};

const toolTipProps = {
    title: String,
    content: String,
    mode: {
        type: String as PropType<'text' | 'confirm' | 'popover'>,
        default: 'text',
    },
    confirmOption: {
        type: Object,
        default: () => defaultConfirmOption,
    },
} as const;

const tooltipPropKeys = Object.keys(toolTipProps);

export default defineComponent({
    name: 'FTooltip',
    props: {
        ...popperProps,
        ...toolTipProps,
        arrow: {
            type: Boolean,
            default: true,
        },
        offset: {
            type: Number,
            default: 8,
        },
    },
    emits: [OK_EVENT, CANCEL_EVENT, UPDATE_MODEL_EVENT],
    setup(props, ctx) {
        useTheme();
        const [currentValue, updateCurrentValue] = useNormalModel(
            props,
            ctx.emit,
        );

        function getPopperSlots() {
            return {
                trigger: ctx.slots.default,
            };
        }

        function handleConfirmCB(name: typeof OK_EVENT | typeof CANCEL_EVENT, event: MouseEvent) {
            updateCurrentValue(false);
            ctx.emit(name, event);
        }

        function renderContent() {
            const content = ctx.slots?.content?.() || props.content;
            const title = ctx.slots?.title?.() || props.title;
            const isConfirm = props.mode === 'confirm';
            const isPopover = props.mode === 'popover';
            if (props.mode === 'text') {
                return content;
            }
            if (isConfirm || isPopover) {
                const mergeOpt = {
                    ...props.confirmOption,
                    ...defaultConfirmOption,
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
                                class={`${prefixCls}-modal-header ${isConfirm && 'is-confirm'
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
                        {content && <div class={contentClass}>{content}</div>}
                        {isConfirm && (
                            <>
                                <FButton
                                    class={`${prefixCls}-modal-btn`}
                                    onClick={(event) =>
                                        handleConfirmCB(OK_EVENT, event)
                                    }
                                    size="small"
                                    type="primary"
                                >
                                    {mergeOpt.okText}
                                </FButton>
                                <FButton
                                    class={`${prefixCls}-modal-btn`}
                                    onClick={(event) =>
                                        handleConfirmCB(CANCEL_EVENT, event)
                                    }
                                    size="small"
                                >
                                    {mergeOpt.cancelText}
                                </FButton>
                            </>
                        )}
                    </>
                );
            }
        }

        return () => {
            const _props = { ...props };
            tooltipPropKeys.forEach((key) => delete _props[key as keyof typeof toolTipProps]);
            if (props.mode === 'confirm') {
                // confirm模式下，只能点击触发
                _props.trigger = 'click';
            }
            return (
                <Popper
                    {..._props}
                    v-model={currentValue.value}
                    popperClass={`${prefixCls} ${prefixCls}-${props.mode} ${_props.popperClass}`}
                    v-slots={getPopperSlots()}
                >
                    {renderContent()}
                </Popper>
            );
        };
    },
});
