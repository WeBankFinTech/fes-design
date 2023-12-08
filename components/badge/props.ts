import { type PropType } from 'vue';
import type { ComponentProps } from '../timeline/utilTypes';

type Size = 'default' | 'small';

export const badgeProps = {
    color: {
        type: String,
        default: '#FF4D4F',
    },
    count: {
        type: [String, Number] as PropType<string | number>,
        default: 0,
    },
    // 不展示数字，只有一个红点
    dot: {
        type: Boolean,
        default: false,
    },
    // 为0 默认不展示
    showZero: {
        type: Boolean,
        default: false,
    },
    // 封顶的数字
    overflowCount: {
        type: Number,
        default: 99,
    },
    size: {
        type: String as PropType<Size>,
        default: 'default',
    },
};

// 组件暴露给外部的 props 类型
export type BadgeProps = ComponentProps<typeof badgeProps>;
