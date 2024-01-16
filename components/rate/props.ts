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
    },
    count: {
        type: Number,
        default: 5,
    },
    // 评分被激活的个数
    value: {
        type: Number,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false,
    },
    // 辅助文字
    texts: {
        type: Array as PropType<string[]>,
    },
    showText: {
        type: Boolean,
        default: false,
    },
    lineStyle: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type RateProps = ComponentProps<typeof rateProps>;

// 评分对象
export type RateItem = {
    active: boolean;
    hover?: boolean;
    half?: boolean;
};
