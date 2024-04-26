import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const textHighlightProps = {
    // 高亮内容，数组
    searchValues: {
        type: Array as PropType<string[]>,
        default: (): string[] => [],
    },
    // 严格模式，是否严格大小写
    strict: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type TextHighlightProps = ExtractPublicPropTypes<
    typeof textHighlightProps
>;
