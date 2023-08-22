import {
    CSSProperties,
    PropType,
    SetupContext,
    SlotsType,
    VNodeChild,
    ComponentObjectPropsOptions,
} from 'vue';
import type { ComponentInnerProps, ComponentProps } from './utilTypes';

/** 严格版本的 Extract */
type StrictExtract<Type, Union extends Type> = Extract<Type, Union>;

/** 时间轴的正方向，值同 flex 布局的 direction */
type TimelineDirection = 'column' | 'row' | 'row-reverse';

/**
 * 时间轴结点中，「标题」相对「轴」的位置
 *
 * 视时间轴为 flex 布局中的主轴
 * - start：表示交叉轴方向的 start 一侧
 * - end：表示交叉轴方向的 end 一侧
 * - alternate: 表示交替排列
 */
type TimelineTitlePosition = 'start' | 'end' | 'alternate';

/**
 * 时间轴结点中，「辅助描述」相对「标题」的位置
 *
 * - under：在标题下方
 * - inline：与标题同行
 * - opposite：在标题对面（跨过时间轴）
 */
type TimelineDescPosition = 'under' | 'inline' | 'opposite';

/**
 * 时间轴结点颜色
 *
 * - info: primary-color
 * - success: success-color
 * - warning: warning-color
 * - error: danger-color
 *
 * ref: _theme/base.ts
 */
export type TimelineIconType = 'info' | 'success' | 'warning' | 'error';

type Color = CSSProperties['color'];
/**
 * 时间轴结点插槽或渲染函数的共同参数
 *
 * - #desc
 * - #icon
 * */
export type TimelineNodeSlotCommonParams = { index: number };

/** 时间轴结点的参数 */
export type TimelineNode = {
    title: string;
    titlePosition?: StrictExtract<TimelineTitlePosition, 'start' | 'end'>;
    desc?: string | ((params: TimelineNodeSlotCommonParams) => VNodeChild);
    icon?:
        | TimelineIconType
        | Color
        | ((params: TimelineNodeSlotCommonParams) => VNodeChild);
};

export const timelineProps = {
    direction: {
        type: String as PropType<TimelineDirection>,
        default: 'column',
    },
    titlePosition: {
        type: String as PropType<TimelineTitlePosition>,
        default: 'end',
    },
    descPosition: {
        type: String as PropType<TimelineDescPosition>,
        default: 'under',
    },
    data: {
        type: Array as PropType<TimelineNode[]>,
        required: true,
    },
    titleClass: { type: String },
    descClass: { type: String },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type TimelineProps = ComponentProps<typeof timelineProps>;

// 组件内部使用的 props 类型（包含了 default）
export type TimelineInnerProps = ComponentInnerProps<typeof timelineProps>;

export type TimelineSlots = {
    desc: TimelineNodeSlotCommonParams;
    icon: TimelineNodeSlotCommonParams;
};

export type TimelineUnboxSlots = SetupContext<
    unknown,
    SlotsType<TimelineSlots>
>['slots'];
