import type { ComponentObjectPropsOptions, PropType, VNode, VNodeChild } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export interface PanePosition {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

// 通用的属性
export const floatingPaneProps = {
    visible: Boolean,
    displayDirective: {
        type: String as PropType<'show' | 'if'>,
        default: 'show',
    },
    title: String as PropType<string | VNode | (() => VNodeChild)>,
    width: {
        type: [String, Number] as PropType<string | number>,
        default: 520,
    },
    zIndex: {
        type: Number,
        default: 3000,
    },
    defaultPosition: {
        type: Object as PropType<PanePosition>,
        default(): PanePosition {
            return {
                top: '50px',
                right: '50px',
            };
        },
    },
    cachePrePosition: {
        type: String as PropType<'sessionStorage' | 'localStorage'>,
        default: 'localStorage',
    },
    getContainer: {
        type: Function as PropType<() => HTMLElement>,
    },
    // 内容外层类名
    contentClass: String,
} as const satisfies ComponentObjectPropsOptions;

export type FloatingPaneProps = ExtractPublicPropTypes<typeof floatingPaneProps>;
