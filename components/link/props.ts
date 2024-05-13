import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export enum Size {
    LARGE = 'large',
    MIDDLE = 'middle',
    SMALL = 'small',
}

export enum Type {
    PRIMARY = 'primary',
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
}

export enum TargetType {
    BLANK = '_blank',
    SELF = '_self',
    PARENT = '_parent',
    TOP = '_top',
}

export const linkProps = {
    size: {
        type: String as PropType<Size>,
        default: Size.MIDDLE,
    },
    type: {
        type: String as PropType<Type>,
        default: Type.PRIMARY,
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
        default: TargetType.SELF,
    },
} as const satisfies ComponentObjectPropsOptions;

export type LinkProps = ExtractPublicPropTypes<typeof linkProps>;
