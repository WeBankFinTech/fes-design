import type { ComponentObjectPropsOptions, PropType } from 'vue';

import type { ExtractPublicPropTypes } from '../_util/interface';
import type { Effect, Size, Type } from './interface';

export const tagProps = {
    type: {
        type: String as PropType<Type>,
        default: 'default',
    },
    closable: {
        type: Boolean,
        default: false,
    },
    backgroundColor: {
        type: String,
        default: '',
    },
    size: {
        type: String as PropType<Size>,
        default: 'middle',
    },
    effect: {
        type: String as PropType<Effect>,
        default: 'light',
    },
    bordered: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;

export type TagProps = ExtractPublicPropTypes<typeof tagProps>;
