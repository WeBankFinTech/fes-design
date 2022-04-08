import type { PropType, ExtractPropTypes } from 'vue';
import { TRIGGER, PLACEMENT } from '../_util/constants';

export const popperProps = {
    modelValue: {
        type: Boolean,
        default: false,
    },
    trigger: {
        type: String as PropType<typeof TRIGGER[number]>,
        default: 'hover',
    },
    placement: {
        type: String as PropType<typeof PLACEMENT[number]>,
        default: 'bottom',
    },
    offset: {
        type: Number,
        default: 6,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    arrow: {
        type: Boolean,
        default: false,
    },
    appendToContainer: {
        type: Boolean,
        default: true,
    },
    popperClass: [String, Array, Object] as PropType<string | [] | object>,
    showAfter: {
        type: Number,
        default: 0,
    },
    hideAfter: {
        type: Number,
        default: 200,
    },
    getContainer: {
        type: Function,
    },
    lazy: {
        type: Boolean,
        default: true,
    },
} as const;

export type PopperProps = Partial<ExtractPropTypes<typeof popperProps>>;
