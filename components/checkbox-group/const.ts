import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { Option } from '../_util/interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const checkboxGroupKey = Symbol('FCheckboxGroup');
export const name = 'FCheckboxGroup';

export type OptionValue = Option['value'];

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
