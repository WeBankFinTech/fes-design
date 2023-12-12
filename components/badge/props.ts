import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import type { ComponentProps } from '../timeline/utilTypes';

type Size = 'middle' | 'small';

type Type = 'primary' | 'success' | 'danger' | 'warning';

export const badgeProps = {
    color: {
        type: String,
    },
    value: {
        type: [String, Number] as PropType<string | number>,
    },
    // 不展示数字，只有一个红点
    isDot: {
        type: Boolean,
        default: false,
    },
    // hidden 默认为false,可以手动控制徽标显隐
    hidden: {
        type: Boolean,
        default: false,
    },
    // 为0 默认不展示，可以手动控制是否展示0的场景
    showZero: {
        type: Boolean,
        default: false,
    },
    // 封顶的数字
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
