import {
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    ref,
} from 'vue';
import { isNil } from 'lodash-es';
import LoadingOutlined from '../icon/LoadingOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useAnimate } from '../_util/use/useAnimate';
import { useTheme } from '../_theme/useTheme';

import useFormAdaptor from '../_util/use/useFormAdaptor';
import type { ExtractPublicPropTypes } from '../_util/interface';
import type { Size, Type } from './interface';

const prefixCls = getPrefixCls('btn');

const loadingIconClassName = `${prefixCls}-loading-icon`;

export const buttonProps = {
    disabled: {
        type: Boolean as PropType<boolean | null | undefined>,
        default: (): boolean | null | undefined => undefined,
    },
    htmlType: {
        type: String as PropType<'button' | 'submit' | 'reset'>,
        default: 'button',
    },
    size: {
        type: String as PropType<Size>,
        default: 'middle',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    long: {
        type: Boolean,
        default: false,
    },
    throttle: {
        type: Number,
        default: 300,
    },
    type: {
        type: String as PropType<Type>,
        default: 'default',
    },
    iconPlacement: {
        type: String as PropType<'left' | 'right'>,
        default: 'left',
    },
} as const satisfies ComponentObjectPropsOptions;

export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>;

export default defineComponent({
    name: 'FButton',
    props: buttonProps,
    emits: ['click'],
    setup(props, { slots, emit }) {
        const { animateClassName, handelAnimate } = useAnimate(400);
        const { isFormDisabled } = useFormAdaptor();

        useTheme();
        const notAllowed = ref(false);

        const buttonDisabled = computed(
            () => {
                if (!isNil(props.disabled)) {
                    return props.disabled;
                }
                return isFormDisabled.value;
            },
        );

        const handleClick = (event: MouseEvent) => {
            if (
                notAllowed.value
                || buttonDisabled.value
                || props.loading
            ) {
                return;
            }

            handelAnimate();

            notAllowed.value = true;
            setTimeout(() => {
                notAllowed.value = false;
            }, props.throttle);
            emit('click', event);
        };

        const classes = computed(() => [
            prefixCls,
            animateClassName.value,
            `${prefixCls}-type-${props.type}`,
            props.long && `${prefixCls}-long`,
            props.size !== 'middle' && `${prefixCls}-${props.size}`,
            props.loading && 'is-loading',
        ]);

        return () => (
            <button
                type={props.htmlType}
                disabled={buttonDisabled.value}
                class={classes.value}
                onClick={handleClick}
            >
                {props.loading
                    ? (
                            <LoadingOutlined class={loadingIconClassName} />
                        )
                    : (props.iconPlacement !== 'right' && slots.icon) && <span class={`${prefixCls}-icon`}>{slots.icon?.()}</span> }
                {slots.default?.()}
                {(props.iconPlacement === 'right' && slots.icon) && <span class={[`${prefixCls}-icon`, 'is-right']}>{slots.icon?.()}</span> }
            </button>
        );
    },
});
