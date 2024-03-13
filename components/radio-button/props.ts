import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import { type RadioValue } from '../radio/props';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const radioButtonProps = {
    disabled: {
        type: Boolean,
    },
    value: {
        type: [String, Number, Boolean] as PropType<RadioValue>,
    },
    label: {
        type: [String, Number] as PropType<string | number>,
    },
} as const satisfies ComponentObjectPropsOptions;

export type RadioButtonProps = ExtractPublicPropTypes<typeof radioButtonProps>;
