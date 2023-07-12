import type { PropType } from 'vue';
import type { Position } from './interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const tabProps = {
    key: [String, Number, Symbol] as PropType<string | number | symbol>,
    value: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    name: [String, Number] as PropType<string | number>,
    disabled: Boolean,
    closable: {
        type: Boolean as PropType<boolean | undefined>,
        default: null as null,
    },
    displayDirective: {
        type: String as PropType<'if' | 'show' | 'show:lazy'>,
        default: 'if',
    },
} as const;

export type TabProps = ExtractPublicPropTypes<typeof tabProps>;

/**
 * 计算TabBar样式
 */
export function computeTabBarStyle(tabEl: Element, pos: Position = 'top') {
    const style = {
        width: '0px',
        height: '0px',
        transform: '',
    };
    if (!tabEl || tabEl.children.length <= 0) return style;
    const firstRect = tabEl.parentElement.children[0].getBoundingClientRect();
    const currRect = tabEl.children[0].getBoundingClientRect();
    switch (pos) {
        case 'left':
        case 'right':
            style.width = '2px';
            style.height = `${currRect.height}px`;
            style.transform = `translate(0px, ${
                currRect.top - firstRect.top
            }px)`;
            break;
        case 'top':
        case 'bottom':
            style.width = `${currRect.width}px`;
            style.height = '2px';
            style.transform = `translate(${
                currRect.left - firstRect.left
            }px, 0px)`;
            break;
        default:
    }
    return style;
}
