import { CSSProperties, VNodeChild, isVNode } from 'vue';
import { isNil } from 'lodash-es';
import { isValidElementNode } from '../_util/vnode';
import { COMPONENT_NAME, prefixCls } from './const';
import type {
    TimelineInnerProps as ComponentProps,
    TimelineIconType,
    TimelineNode,
} from './props';

export const cls = (className: string) => `${prefixCls}-${className}`;
export const dotCls = (className: string) => `.${cls(className)}`;

export const warn = (...log: any[]) =>
    console.warn(`[${COMPONENT_NAME}]:`, ...log);

export type StrictExtract<T, U extends T> = U extends T ? U : never;

export const isPresetIconTypes = (icon: any): icon is TimelineIconType => {
    const preset: TimelineIconType[] = ['info', 'success', 'warning', 'error'];
    return preset.includes(icon);
};

export const getTitleOppositePosition = (
    position: TimelineNode['titlePosition'],
): TimelineNode['titlePosition'] => {
    return position === 'start' ? 'end' : 'start';
};

export const isValidRenderResult = (result: VNodeChild): boolean => {
    if (Array.isArray(result)) {
        return result.some((node) => isValidRenderResult(node));
    }
    if (isVNode(result)) {
        return isValidElementNode(result);
    }
    return !isNil(result);
};

export const calcTitlePosition = (
    index: number,
    propPosition: ComponentProps['titlePosition'],
    nodePosition: TimelineNode['titlePosition'],
): TimelineNode['titlePosition'] => {
    // 组件设置的布局方式优先级最高
    if (propPosition !== 'alternate') {
        return propPosition;
    }
    // 只有设置了交叉布局，node 自定义的位置才会生效
    if (nodePosition) {
        return nodePosition;
    }
    // 交叉布局且 node 未自定义时，交替排列
    return index % 2 === 0 ? 'start' : 'end';
};

export const calcDescPosition = (
    direction: ComponentProps['direction'],
    descPosition: ComponentProps['descPosition'],
): ComponentProps['descPosition'] => {
    if (
        (direction === 'row' || direction === 'row-reverse') &&
        descPosition === 'inline'
    ) {
        warn('横向时间轴中不支持标题和辅助描述同行');
        return 'under';
    }
    return descPosition;
};

export const calcInlineStartProp = (
    axisDirection: ComponentProps['direction'],
): StrictExtract<keyof CSSProperties, 'top' | 'left' | 'right'> => {
    if (axisDirection === 'row') return 'left';
    if (axisDirection === 'row-reverse') return 'right';
    return 'top';
};

export const calcLengthProp = (
    axisDirection: ComponentProps['direction'],
): StrictExtract<keyof CSSProperties, 'height' | 'width'> => {
    return axisDirection === 'column' ? 'height' : 'width';
};

export const calcDimensionProp = (
    axisDirection: ComponentProps['direction'],
): StrictExtract<keyof DOMRect, 'height' | 'width'> => {
    return axisDirection === 'column' ? 'height' : 'width';
};
