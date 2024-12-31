import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const backTopProps = {
    // 触发滚动的容器对象
    target: {
        type: HTMLElement,
    },
    // 滚动高度达到此参数值才出现
    visibilityHeight: {
        type: Number,
        default: 200,
    },
    // 控制其显示位置，距离容器右边距离
    right: {
        type: Number,
        default: 40,
    },
    // 控制其显示位置，距离容器底部距离
    bottom: {
        type: Number,
        default: 40,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type BackTopProps = ExtractPublicPropTypes<typeof backTopProps>;

export const backTopEmits = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};
export type BackTopEmits = typeof backTopEmits;
