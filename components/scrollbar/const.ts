import { PropType, CSSProperties, ExtractPropTypes } from 'vue';

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
    containerStyle: Object as PropType<CSSProperties>,
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

export type ScrollbarProps = Partial<ExtractPropTypes<typeof scrollbarProps>>;
