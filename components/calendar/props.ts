import {
    type ComponentObjectPropsOptions,
    type DefineComponent,
    type PropType,
    type SetupContext,
    type SlotsType,
} from 'vue';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import { type UnixTime } from './types';
import type { ComponentProps } from '../timeline/utilTypes';

/**
 * Calendar 显示模式
 *
 * month - 月历
 * date - 日历
 */
export type CalendarMode = 'month' | 'date';

export type CalendarShortcut = {
    label: string;
    time: UnixTime | (() => UnixTime);
};

export const calendarProps = {
    /** 当前高亮标记的日期 */
    modelValue: {
        type: Number as PropType<UnixTime>,
        default: () => Date.now(),
    },
    /** 显示模式 */
    mode: {
        type: String as PropType<CalendarMode>,
        default: 'date',
        validator: (value) =>
            (['date', 'month'] satisfies CalendarMode[]).includes(
                value as unknown as CalendarMode,
            ),
    },
    /** 是否展示分割线 */
    splitLine: {
        type: Boolean,
        default: true,
    },
    /** 组件高度 */
    height: {
        type: [String, Number] as PropType<string | number>,
    },
    /** 快捷选项 */
    shortcuts: {
        type: Object as PropType<CalendarShortcut[]>,
        default: () => [] as CalendarShortcut[],
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type CalendarProps = ComponentProps<typeof calendarProps>;

export type CalendarInnerProps = Parameters<
    DefineComponent<typeof calendarProps>['setup']
>[0];

export const CalendarEvent = {
    UPDATE_MODEL: UPDATE_MODEL_EVENT,
    UPDATE_MODE: 'update:mode',
    CELL_CLICK: 'cellClick',
} as const;

export type CalendarSlots = {
    // 	单元格
    cellMain: { date: UnixTime; mode: CalendarMode };
    // 单元格附加内容
    cellAppendant: { date: UnixTime; mode: CalendarMode };
};

export type CalendarUnboxSlots = SetupContext<
    unknown,
    SlotsType<CalendarSlots>
>['slots'];
