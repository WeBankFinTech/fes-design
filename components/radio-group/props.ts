import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type {
    ComponentInnerProps,
    ExtractPublicPropTypes,
    Option,
} from '../_util/interface';
import type { OptionType, Size, Type } from './interface';

export const radioGroupProps = {
    modelValue: {
        type: [String, Number, Boolean] as PropType<string | number | boolean>,
        default: (): void => void 0,
    },
    vertical: Boolean,
    disabled: Boolean,
    cancelable: {
        type: Boolean,
        default: true,
    },
    options: {
        type: Array as PropType<Option[] | null>,
        default: () => [] as Option[],
    },
    valueField: {
        type: String,
        default: 'value',
    },
    labelField: {
        type: String,
        default: 'label',
    },
    size: {
        type: String as PropType<Size>,
        default: 'middle' as Size,
    },
    type: {
        type: String as PropType<Type>,
        default: 'default' as Type,
    },
    bordered: {
        type: Boolean,
        default: true,
    },
    optionType: {
        type: String as PropType<OptionType>,
        default: 'default' as OptionType,
    },
    fullLine: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type RadioGroupProps = ExtractPublicPropTypes<typeof radioGroupProps>;

export type RadioGroupInnerProps = ComponentInnerProps<typeof radioGroupProps>;
