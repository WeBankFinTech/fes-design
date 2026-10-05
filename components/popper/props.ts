import type { ComponentObjectPropsOptions, PropType, StyleValue } from 'vue';
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
        type: [String, Array, Object] as PropType<StyleValue>,
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
    /**
     * @deprecated 请使用 keepVisible，语义更准确（显示后不再因移出触发器隐藏）
     * 弹层显示后仅跟随触发器位置更新，不因 hover/click 等交互隐藏
     */
    onlyShowTrigger: {
        type: Boolean,
    },
    /**
     * 弹层显示后不再隐藏（保持可见），仅跟随触发器位置更新；
     * 与 onlyShowTrigger 等价，任一为 true 即生效
     */
    keepVisible: {
        type: Boolean,
    },
    passive: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;

export type PopperProps = ExtractPublicPropTypes<typeof popperProps>;
