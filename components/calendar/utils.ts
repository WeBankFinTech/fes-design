import { type Day, addMonths, getDaysInMonth, set, subDays } from 'date-fns';
import { isNil } from 'lodash-es';
import { prefixCls } from './const';
import { type CalendarDate, type UnixTime } from './types';

export const cls = (className: string) => `${prefixCls}-${className}`;

/**
 * 根据一个 Date，计算其所在月份日历
 *
 * @param date 输入的 Date
 * @param options 选项
 * @param options.startDay 一周的第一天，默认为周一
 * @param options.weekNum 一个月的周数，默认为 6
 * @returns 日历数据
 */
export const generateCalendarDates = (
    date: CalendarDate,
    options?: {
        startDay?: Day;
        weekNum?: number;
    },
): CalendarDate[] => {
    const calendarDates: CalendarDate[] = [];

    const startDay: Day = !isNil(options?.startDay) ? options.startDay : 1; // 默认周一
    const monthFirstDate = new Date(date.year, date.month, 1);
    const calendarFirstDate = subDays(
        monthFirstDate,
        monthFirstDate.getDay() - startDay,
    );

    // 上一个月
    calendarDates.push(
        ...new Array(Math.abs(monthFirstDate.getDay() - startDay))
            .fill(NaN)
            .map((_, index) => ({
                year: calendarFirstDate.getFullYear(),
                month: calendarFirstDate.getMonth(),
                date: calendarFirstDate.getDate() + index,
            })),
    );

    // 当前月
    calendarDates.push(
        ...new Array(getDaysInMonth(monthFirstDate))
            .fill(NaN)
            .map((_, index) => ({
                year: monthFirstDate.getFullYear(),
                month: monthFirstDate.getMonth(),
                date: monthFirstDate.getDate() + index,
            })),
    );

    // 周数计算，日历显示的天数
    const calendarDateNum = !isNil(options?.weekNum) ? options.weekNum * 7 : 35;

    if (calendarDates.length > calendarDateNum) {
        return calendarDates.slice(0, calendarDateNum);
    }

    // 下个月
    const nextMonthFirstDate = addMonths(monthFirstDate, 1);
    calendarDates.push(
        ...new Array(calendarDateNum - calendarDates.length)
            .fill(NaN)
            .map((_, index) => ({
                year: nextMonthFirstDate.getFullYear(),
                month: nextMonthFirstDate.getMonth(),
                date: nextMonthFirstDate.getDate() + index,
            })),
    );

    return calendarDates;
};

/**
 * 根据一个 Date，计算其所在月份月历
 *
 * @param date 输入的 Date
 */
export const generateCalendarMonths = (date: CalendarDate): CalendarDate[] => {
    const calendarMonths: CalendarDate[] = new Array(12)
        .fill(null)
        .map((_, month) => ({
            month,
            year: date.year,
            date: 1,
        }));

    return calendarMonths;
};

export const isSameDate = (
    date1: CalendarDate,
    date2: CalendarDate,
): boolean => {
    return (
        date1.year === date2.year
        && date1.month === date2.month
        && date1.date === date2.date
    );
};

export const isSameMonth = (
    date1: CalendarDate,
    date2: CalendarDate,
): boolean => {
    return date1.year === date2.year && date1.month === date2.month;
};

export const convertDateToCalendarDate = (date: Date): CalendarDate => ({
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
});

export const convertCalendarDateToDate = (date: CalendarDate): Date =>
    new Date(date.year, date.month, date.date);

/**
 * 将 Unix 原子时转换为 CalendarDate
 * @param time UnixTime
 */
export const convertUnixTimeToCalendarDate = (time: UnixTime): CalendarDate =>
    convertDateToCalendarDate(new Date(time));

/**
 * 将 CalendarDate 转换为 Unix 原子时
 * @param date CalendarDate
 * @param precisionOffset 补偿 CalendarDate 中没有的「时、分、秒、毫秒」精度数据。若值大于 24 小时，则取时间部分的值，日期部分取 CalendarDate 中的
 */
export const convertCalendarDateToUnixTime = (
    date: CalendarDate,
    precisionOffset?: UnixTime,
): UnixTime => {
    const time = !isNil(precisionOffset)
        ? new Date(precisionOffset)
        : new Date();

    const resultTime = set(new Date(), {
        year: date.year,
        month: date.month,
        date: date.date,
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
        milliseconds: time.getMilliseconds(),
    });

    return resultTime.valueOf();
};

export const getToday = (): CalendarDate => {
    const date = new Date();
    return convertDateToCalendarDate(date);
};
