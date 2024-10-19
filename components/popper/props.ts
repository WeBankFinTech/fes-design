import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { PLACEMENT, TRIGGER } from '../_util/constants';
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
    popperStyle: {
        type: Object,
        default: () => ({}),
    },
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
    passive: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;

export type PopperProps = ExtractPublicPropTypes<typeof popperProps>;
