import { PropType } from 'vue';

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
