import { h, ref, Transition, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import CloseCircleOutlined from '../icon/CloseCircleOutlined';
import { CLOSE_EVENT } from '../_util/constants';
import { iconComponentMap } from '../_util/noticeManager';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('alert');

const alertProps = {
    message: String,
    description: String,
    showIcon: Boolean,
    closable: Boolean,
    center: Boolean,
    type: {
        type: String,
        default: 'info',
        validator(value: string) {
            return Object.keys(iconComponentMap).includes(value);
        },
    },
    beforeClose: {
        type: Function,
        default: () => true,
    },
} as const;

export default defineComponent({
    name: 'FAlert',
    components: { ...Object.values(iconComponentMap), CloseCircleOutlined },
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

        return () => {
            const {
                action: actionSlot,
                default: defaultSlot,
                icon: iconSlot,
                description: descriptionSlot,
            } = ctx.slots;
            const bodyClass = [
                `${prefixCls}-body`,
                props.showIcon && !props.center && `${prefixCls}-icon-padding`,
            ];
            const description =
                props.description || descriptionSlot ? (
                    <div class={bodyClass.filter(Boolean).join(' ')}>
                        {descriptionSlot
                            ? descriptionSlot()
                            : props.description}
                    </div>
                ) : null;

            const Icon = iconComponentMap[props.type];
            return (
                <Transition name={`${prefixCls}-fade-expand`}>
                    {!visible.value ? null : (
                        <div
                            class={`${prefixCls} ${props.center
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
                                            {iconSlot
                                                ? iconSlot()
                                                : Icon && <Icon />}
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
