import { type ComponentObjectPropsOptions, type PropType } from 'vue';
import { PROGRESS_TYPE } from './const';
import type { ExtractPublicPropTypes } from '../_util/interface';

type ProgressType = 'line' | 'circle';

const commonProps = {
    percent: {
        type: Number,
        default: 0,
    },
    color: {
        type: String,
    },
};

// 条形进度条的props
export const lineProgressProps = {
    ...commonProps,
    // 是否內显百分比
    showInnerPercent: {
        type: Boolean,
        default: false,
    },
    // 是否外显百分比
    showOutPercent: {
        type: Boolean,
        default: false,
    },
    height: {
        type: Number,
        default: 8,
    },
};

// 环形进度条的props
export const circleProgressProps = {
    ...commonProps,
    width: {
        type: Number,
        default: 8,
    },
    // 环形直径大小
    circleSize: {
        type: Number,
        default: 160,
    },
    showCircleText: {
        type: Boolean,
        default: false,
    },
};

export const progressProps = {
    ...commonProps,
    ...lineProgressProps,
    ...circleProgressProps,
    type: {
        type: String as PropType<ProgressType>,
        default: PROGRESS_TYPE.LINE satisfies ProgressType,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type ProgressProps = ExtractPublicPropTypes<typeof progressProps>;
