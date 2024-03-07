import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import { type ExtractPublicPropTypes } from '../_util/interface';

export type Shape = 'square' | 'circle';

type Fit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

export type Size = 'small' | 'middle' | 'large' | number;

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
        type: [String, Number] as PropType<Size>,
        default: 'middle' satisfies Size,
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

// 组件暴露给外部的 props 类型
export type AvatarProps = ExtractPublicPropTypes<typeof avatarProps>;
