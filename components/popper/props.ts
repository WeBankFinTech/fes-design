import { TRIGGER, PLACEMENT } from '../_util/constants';
import type { PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const popperProps = {
    modelValue: {
        type: Boolean,
        default: false,
    },
    trigger: {
        type: String as PropType<(typeof TRIGGER)[number]>,
        default: 'hover',
    },
    placement: {
        type: String as PropType<(typeof PLACEMENT)[number]>,
        default: 'bottom',
    },
    offset: {
        type: Number,
        default: 6,
    },
    disabled: {
        type: [Boolean, Function] as PropType<boolean | (() => boolean)>,
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
    onlyShowTrigger: {
        type: Boolean,
    },
} as const;

export type PopperProps = ExtractPublicPropTypes<typeof popperProps>;
