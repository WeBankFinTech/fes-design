import type { ComponentObjectPropsOptions, PropType, StyleValue } from 'vue';

import type { Shadow, Size } from './interface';

export const cardProps = {
    header: {
        type: String,
        default: '',
    },
    divider: {
        type: Boolean,
        default: true,
    },
    bodyStyle: {
        type: Object as PropType<StyleValue>,
        default: () => ({} as StyleValue),
    },
    size: {
        type: String as PropType<Size>,
        default: 'middle',
    },
    shadow: {
        type: String as PropType<Shadow>,
        default: 'always',
    },
    bordered: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;
