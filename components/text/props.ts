import type { PropType } from 'vue';

import type { Type, Size } from './interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

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
} as const;

export type TextProps = ExtractPublicPropTypes<typeof textProps>;
