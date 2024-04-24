import type { ComponentObjectPropsOptions, PropType } from 'vue';

import type { ExtractPublicPropTypes } from '../_util/interface';
import type { Size, Type } from './interface';

export const textProps = {
    type: {
        type: String as PropType<Type>,
        default: 'default',
    },
    size: {
        type: String as PropType<Size>,
        default: 'middle',
    },
    strong: Boolean,
    italic: Boolean,
    tag: {
        type: String,
        default: 'span',
    },
} as const satisfies ComponentObjectPropsOptions;

export type TextProps = ExtractPublicPropTypes<typeof textProps>;
