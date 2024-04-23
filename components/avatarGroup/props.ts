import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import { type Shape, type Size } from '../avatar/props';
import { type ExtractPublicPropTypes } from '../_util/interface';

interface AvatarOption {
    name: string;
    src: string;
    text: string;
    icon: string;
}

// 头像组
export const avatarGroupProps = {
    // 统一展示的头像大小
    size: {
        type: [String, Number] as PropType<Size>,
        default: 'middle' satisfies Size,
    },
    // 默认圆形
    shape: {
        type: String as PropType<Shape>, // 引用头像组件的类型，保持一致
        default: 'circle' satisfies Shape,
    },
    // 组内展示头像的最大数，超过展示+xxx
    max: {
        type: Number,
        default: 3,
    },
    options: {
        type: Array as PropType<Partial<AvatarOption>[]>,
    },
    // 是否展示hover气泡
    expandOnHover: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type AvatarGroupProps = ExtractPublicPropTypes<typeof avatarGroupProps>;
