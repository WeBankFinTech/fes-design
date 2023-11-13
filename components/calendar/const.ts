import getPrefixCls from '../_util/getPrefixCls';

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
