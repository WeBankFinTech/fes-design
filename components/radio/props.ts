import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export type RadioValue = string | number | boolean;

export const radioProps = {
    modelValue: Boolean,
    value: [String, Number, Boolean] as PropType<RadioValue>,
    label: [String, Number] as PropType<string | number>,
    disabled: Boolean,
} as const satisfies ComponentObjectPropsOptions;

export type RadioProps = ExtractPublicPropTypes<typeof radioProps>;
