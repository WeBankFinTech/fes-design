import { PropType, CSSProperties } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const PROVIDE_KEY = Symbol('scrollbar');
export const CONTAINER_PROVIDE_KEY = Symbol('scrollbar-container');

export const BAR_MAP = {
    vertical: {
        offset: 'offsetHeight',
        scroll: 'scrollTop',
        scrollSize: 'scrollHeight',
        size: 'height',
        key: 'vertical',
        axis: 'Y',
        client: 'clientY',
        direction: 'top',
    },
    horizontal: {
        offset: 'offsetWidth',
        scroll: 'scrollLeft',
        scrollSize: 'scrollWidth',
        size: 'width',
        key: 'horizontal',
        axis: 'X',
        client: 'clientX',
        direction: 'left',
    },
} as const;

export type ShadowType = boolean | { x: boolean; y: boolean };

export const COMMON_PROPS = {
    shadow: {
        type: [Boolean, Object] as PropType<ShadowType>,
        default: false,
    },
};

export const scrollbarProps = {
    height: {
        type: [Number, String] as PropType<number | string>,
    },
    maxHeight: {
        type: [Number, String] as PropType<number | string>,
    },
    native: {
        type: Boolean,
        default: false,
    },
    containerClass: [Array, Object, String] as PropType<string | object | []>,
    containerStyle: [String, Object] as PropType<string | CSSProperties>,
    contentStyle: [String, Object] as PropType<string | CSSProperties>,
    horizontalRatioStyle: [String, Object] as PropType<string | CSSProperties>,
    verticalRatioStyle: [String, Object] as PropType<string | CSSProperties>,
    shadowStyle: [String, Object] as PropType<string | CSSProperties>,
    noresize: Boolean,
    always: {
        type: Boolean,
        default: false,
    },
    minSize: {
        type: Number,
        default: 20,
    },
    ...COMMON_PROPS,
} as const;

export type ScrollbarProps = ExtractPublicPropTypes<typeof scrollbarProps>;
