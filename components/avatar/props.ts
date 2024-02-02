import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import type { ComponentProps } from '../timeline/utilTypes';

type Shape = 'square' | 'circle';

type Fit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

type Avatar = {
    name?: string;
    src?: string;
};

export const avatarProps = {
    // 自定义背景色
    backgroundColor: {
        type: String,
    },
    // 自定义文字颜色
    color: {
        type: String,
    },
    size: {
        type: Number,
        default: 24,
    },
    // 默认圆形
    shape: {
        type: String as PropType<Shape>,
        default: 'circle' satisfies Shape,
    },
    // 头像图片链接
    src: {
        type: String,
    },
    // 头像加载失败的图片地址
    fallbackSrc: {
        type: String,
    },
    // 设置图片如何适应容器
    fit: {
        type: String as PropType<Fit>,
        default: 'fill' satisfies Fit,
    },
} as const satisfies ComponentObjectPropsOptions;

// 头像组
export const avatarGroupProps = {
    // 统一展示的头像大小
    size: {
        type: Number,
        default: 24,
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
};

// 组件暴露给外部的 props 类型
export type AvatarProps = ComponentProps<typeof avatarProps>;
