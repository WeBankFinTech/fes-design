import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import { type Shape } from '../avatar/props';
import type { ComponentProps } from '../timeline/utilTypes';

type Avatar = {
    name?: string;
    src?: string;
    text?: string | number;
    icon?: string;
};

// 头像组
export const avatarGroupProps = {
    // 统一展示的头像大小
    size: {
        type: Number,
        default: 24,
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
        type: Array as PropType<Avatar[]>,
    },
    // 是否展示hover气泡
    showHoverTip: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type AvatarGroupProps = ComponentProps<typeof avatarGroupProps>;
