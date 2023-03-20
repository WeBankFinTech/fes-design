import type { PropType, StyleValue } from 'vue';
import type { InputValue } from './interface';

export const commonInputProps = {
    modelValue: {
        type: [Number, String] as PropType<InputValue>,
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false,
    },
    maxlength: {
        type: Number,
    },
    showPassword: {
        type: Boolean,
        default: false,
    },
    inputStyle: {
        type: Object as PropType<StyleValue>,
        default: () => ({} as StyleValue),
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
} as const;
