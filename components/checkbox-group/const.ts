import type { PropType } from 'vue';
import type { Option } from '../_util/interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const checkboxGroupKey = Symbol('FCheckboxGroup');
export const name = 'FCheckboxGroup';

type OptionValue = string | number | boolean;

export const checkboxGroupProps = {
    modelValue: {
        type: Array as PropType<OptionValue[]>,
        default: () => [] as OptionValue[],
    },
    vertical: Boolean,
    disabled: Boolean,
    options: {
        type: Array as PropType<Option[]>,
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
} as const;

export type CheckboxGroupProps = ExtractPublicPropTypes<
    typeof checkboxGroupProps
>;
