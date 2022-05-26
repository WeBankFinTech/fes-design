import type { PropType } from 'vue';

import type { Type, Size, Effect } from './interface';

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
} as const;
