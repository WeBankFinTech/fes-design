import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import type { ComponentProps } from '../timeline/utilTypes';

type Size = 'large' | 'medium' | 'small';

export const rateProps = {
    size: {
        type: String as PropType<Size>,
        default: 'medium',
    },
    half: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: '#F29360',
    },
    count: {
        type: Number,
        default: 5,
    },

    // 评分被激活的个数
    value: {
        type: Number,
        default: 0,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type RateProps = ComponentProps<typeof rateProps>;

export type RateItem = {
    active: boolean;
};
