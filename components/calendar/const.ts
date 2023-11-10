import getPrefixCls from '../_util/getPrefixCls';
import { Option } from '../_util/interface';
import { CalendarMode } from './props';

export const COMPONENT_NAME = 'FCalendar';

export const prefixCls = getPrefixCls('calendar');

/**
 * Calendar 行数
 *
 * 固定 6 行，保证能展示所有日期
 */
export const CALENDAR_ROW_NUM = 6;

/** Calendar 列数 */
export const CALENDAR_COLUMN_NUM = 7;

/** 日历、月历模式切换的选项 */
export const CALENDAR_MODE_OPTIONS: Option[] = [
    // 日历模式
    { label: '月', value: 'date' },
    // 月历模式
    { label: '年', value: 'month' },
] satisfies { label: Option['label']; value: CalendarMode }[];
