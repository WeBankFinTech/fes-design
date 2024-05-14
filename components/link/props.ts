import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

type Size = 'large' | 'middle' | 'small';

type Type = 'default' | 'primary' | 'success' | 'danger' | 'warning';

type TargetType = '_blank' | '_self' | '_parent' | '_top';

export const linkProps = {
    size: {
        type: String as PropType<Size>,
        default: 'middle',
    },
    type: {
        type: String as PropType<Type>,
        default: 'default',
    },
    underline: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    href: {
        type: String,
    },
    target: {
        type: String as PropType<TargetType>,
    },
} as const satisfies ComponentObjectPropsOptions;

export type LinkProps = ExtractPublicPropTypes<typeof linkProps>;
