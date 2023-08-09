import { SetupContext, SlotsType } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { TimelineNodeSlotCommonParams, timelineProps } from './props';
import { ComponentInnerProps } from './utilTypes';

export const COMPONENT_NAME = 'FTimeline';
export const prefixCls = getPrefixCls('timeline');
export const cls = (className: string) => `${prefixCls}-${className}`;

export const warn = (...log: any[]) =>
    console.warn(`[${COMPONENT_NAME}]:`, ...log);

export type ComponentProps = ComponentInnerProps<typeof timelineProps>;
export type ComponentSlots = {
    desc: TimelineNodeSlotCommonParams;
    icon: TimelineNodeSlotCommonParams;
};
export type ComponentUnboxSlots = SetupContext<
    unknown,
    SlotsType<ComponentSlots>
>['slots'];
