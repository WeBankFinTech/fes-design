import { ref, Transition, computed, defineComponent, PropType } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import CloseCircleOutlined from '../icon/CloseCircleOutlined';
import { CLOSE_EVENT } from '../_util/constants';
import { iconComponentMap } from '../_util/noticeManager';
import { useTheme } from '../_theme/useTheme';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('alert');

export const alertProps = {
    message: String,
    description: String,
    showIcon: Boolean,
    closable: Boolean,
    center: Boolean,
    type: {
        type: String as PropType<keyof typeof iconComponentMap>,
        default: 'info',
    },
    beforeClose: {
        type: Function,
        default: () => true,
    },
} as const;

export type AlertProps = ExtractPublicPropTypes<typeof alertProps>;

export default defineComponent({
    name: 'FAlert',
    props: alertProps,
    emits: [CLOSE_EVENT],
    setup(props, ctx) {
        useTheme();
        const visible = ref(true);
        function handleCloseClick(event: MouseEvent) {
            Promise.resolve(props.beforeClose?.(event)).then((res) => {
                if (res) {
                    visible.value = false;
                    ctx.emit(CLOSE_EVENT);
                }
            });
        }

        const bodyClass = computed(() => [
            `${prefixCls}-body`,
            props.showIcon && !props.center && `${prefixCls}-icon-padding`,
        ]);

        const renderIcon = () => {
            return ctx.slots.icon
                ? ctx.slots.icon()
                : iconComponentMap[props.type]?.();
        };

        return () => {
            const {
                action: actionSlot,
                default: defaultSlot,
                description: descriptionSlot,
            } = ctx.slots;

            const description =
                props.description || descriptionSlot ? (
                    <div class={bodyClass.value}>
                        {descriptionSlot
                            ? descriptionSlot()
                            : props.description}
                    </div>
                ) : null;

            return (
                <Transition name={`${prefixCls}-fade-expand`}>
                    {!visible.value ? null : (
                        <div
                            class={`${prefixCls} ${
                                props.center
                                    ? `${prefixCls}-message-center`
                                    : ''
                            } ${prefixCls}-${props.type}`}
                        >
                            <div class={`${prefixCls}-head`}>
                                <div class={`${prefixCls}-head-message`}>
                                    {props.showIcon ? (
                                        <div
                                            class={`${prefixCls}-head-message-icon`}
                                        >
                                            {renderIcon()}
                                        </div>
                                    ) : null}
                                    <div>
                                        {defaultSlot
                                            ? defaultSlot()
                                            : props.message}
                                    </div>
                                </div>
                                <div class={`${prefixCls}-head-right`}>
                                    {actionSlot ? (
                                        <div
                                            class={`${prefixCls}-head-right-action`}
                                        >
                                            {actionSlot()}
                                        </div>
                                    ) : null}
                                    {props.closable ? (
                                        <div
                                            class={`${prefixCls}-head-right-close`}
                                        >
                                            <CloseCircleOutlined
                                                onClick={handleCloseClick}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            {description}
                        </div>
                    )}
                </Transition>
            );
        };
    },
});
