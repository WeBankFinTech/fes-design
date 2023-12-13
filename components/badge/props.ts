import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import type { ComponentProps } from '../timeline/utilTypes';

type Size = 'middle' | 'small';

type Type = 'primary' | 'success' | 'danger' | 'warning';

export const badgeProps = {
    // 显示内容
    value: {
        type: [String, Number] as PropType<string | number>,
    },
    // 是否红点模式
    dot: {
        type: Boolean,
        default: false,
    },
    // 自定义背景色
    backgroundColor: {
        type: String,
    },
    // 是否展示数据0的情况
    showZero: {
        type: Boolean,
        default: false,
    },
    // 是否隐藏
    hidden: {
        type: Boolean,
        default: false,
    },
    // 封顶阈值
    max: {
        type: Number,
        default: 99,
    },
    size: {
        type: String as PropType<Size>,
        default: 'middle',
    },
    type: {
        type: String as PropType<Type>,
        default: 'danger',
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type BadgeProps = ComponentProps<typeof badgeProps>;
