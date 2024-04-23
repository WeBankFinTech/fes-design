import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export type CheckboxValue = string | number | boolean;

export const checkboxProps = {
    modelValue: Boolean,
    indeterminate: Boolean,
    value: [String, Number, Boolean] as PropType<CheckboxValue>,
    label: [String, Number] as PropType<string | number>,
    disabled: Boolean,
} as const satisfies ComponentObjectPropsOptions;

export type CheckboxProps = ExtractPublicPropTypes<typeof checkboxProps>;
