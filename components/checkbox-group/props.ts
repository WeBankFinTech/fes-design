import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { OptionValue } from './interface';
import type {
    ComponentInnerProps,
    ExtractPublicPropTypes,
    Option,
} from '../_util/interface';

export const checkboxGroupProps = {
    modelValue: {
        type: Array as PropType<OptionValue[]>,
        default: () => [] as OptionValue[],
    },
    vertical: Boolean,
    disabled: Boolean,
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
} as const satisfies ComponentObjectPropsOptions;

export type CheckboxGroupProps = ExtractPublicPropTypes<
    typeof checkboxGroupProps
>;

export type CheckboxGroupInnerProps = ComponentInnerProps<
    typeof checkboxGroupProps
>;
