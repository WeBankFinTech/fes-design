import { parse, format, endOfMonth, isValid } from 'date-fns';
import { isNumber } from 'lodash-es';

import { RANGE_POSITION } from './const';
import type { DateObj, ParticalDateObj } from './interface';

// TODO 国际化
export function strictParse(
    string: string,
    pattern: string,
    backup: Date,
): Date {
    const result = parse(string, pattern, backup);
    if (!isValid(result)) return result;
    else if (format(result, pattern) === string) return result;
    else return new Date(NaN);
}

export const isEmptyValue = (val: any) => {
    if (!val) return true;
    if (Array.isArray(val)) {
        return val.length === 0;
    }
    return false;
};

// FEATURE 以后时间相关的功能，都基于 date-fns 实现
function timeFormat(date: null, format: string): null;
function timeFormat(date: number | Date, format: string): string;
function timeFormat(date: number | Date | null, format = 'yyyy-MM-dd') {
    if (!date) return null;
    if (isNumber(date)) {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours24 = date.getHours();
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const dd = (t: number) => `0${t}`.slice(-2);
    const map = {
        yyyy: year,
        MM: dd(month + 1),
        MMMM: `${month + 1}月`,
        M: month + 1,
        dd: dd(day),
        d: day,
        HH: dd(hours24),
        H: hours24,
        hh: dd(hours),
        h: hours,
        mm: dd(minutes),
        m: minutes,
        ss: dd(seconds),
        s: seconds,
        S: milliseconds,
        Q: `Q${Math.floor(month / 3) + 1}`,
    } as const;
    return format.replace(/y+|M+|d+|H+|h+|m+|s+|S+|Q/g, (str) =>
        String(map[str as keyof typeof map]),
    );
}

export { timeFormat };

export const contrastDate = (
    date1: number | Date,
    date2: number | Date,
    format = 'yyyy-MM-dd HH:mm:ss',
) => {
    const t1 = timeFormat(date1, format);
    const t2 = timeFormat(date2, format);
    if (t1 > t2) return 1;
    if (t1 === t2) return 0;
    return -1;
};

export const parseDate = (date?: number | Date) => {
    const vDate = new Date(date || Date.now());
    return {
        year: vDate.getFullYear(),
        month: vDate.getMonth(),
        day: vDate.getDate(),
        hour: vDate.getHours(),
        minute: vDate.getMinutes(),
        second: vDate.getSeconds(),
    };
};

export const pickTime = (dateObj: DateObj) => {
    return {
        hour: dateObj.hour,
        minute: dateObj.minute,
        second: dateObj.second,
    };
};

export function dateObjToDate(date: ParticalDateObj, isFullMax = false) {
    if (!date) return null;
    // 将季度转换为月份
    const month = date.month ?? (date.quarter ? (date.quarter - 1) * 3 : null);
    if (isFullMax) {
        const month = date.month ?? 11;
        const maxDay = new Date(date.year, month + 1, 0).getDate();
        return new Date(
            date.year,
            month ?? 11,
            date.day ?? maxDay,
            date.hour ?? 23,
            date.minute ?? 59,
            date.second ?? 59,
            999,
        );
    }
    return new Date(
        date.year,
        month ?? 0,
        date.day ?? 1,
        date.hour ?? 0,
        date.minute ?? 0,
        date.second ?? 0,
        0,
    );
}

export function transformDateToTimestamp(
    date: ParticalDateObj,
    isFullMax = false,
) {
    if (!date) return null;
    return dateObjToDate(date, isFullMax).getTime();
}

export const padStartZero = (target: number | string, len = 2) =>
    `${target}`.padStart(len, '0');

export const getTimestampFromFormat = (
    date: Date | null,
    format: string,
    isFullMax?: boolean,
) => {
    date = date || new Date();
    const dateObj: ParticalDateObj = {
        year: date.getFullYear(),
    };

    if (/M/.test(format)) {
        dateObj.month = date.getMonth();
    }

    if (/d/.test(format)) {
        dateObj.day = date.getDate();
    }

    if (/H/.test(format)) {
        dateObj.hour = date.getHours();
    }

    if (/m/.test(format)) {
        dateObj.minute = date.getMinutes();
    }

    if (/s/.test(format)) {
        dateObj.second = date.getSeconds();
    }

    if (/Q/.test(format)) {
        dateObj.quarter = Math.floor(date.getMonth() / 3) + 1;
    }

    return transformDateToTimestamp(dateObj, isFullMax);
};

export const transformTimeToDate = (timeStr: string) => {
    if (!/^\d{1,2}:\d{1,2}:\d{1,2}$/.test(timeStr)) {
        console.warn(
            `[fes-date-picker] defaultTime format expect: HH:mm:ss，now is ${timeStr}`,
        );
        timeStr = '00:00:00';
    }
    const times = timeStr.split(':');
    return {
        hour: Number(times[0]),
        minute: Number(times[1]),
        second: Number(times[2]),
    };
};

export const fillDate = ({
    dateObj,
    format,
    defaultTime,
    rangePosition,
}: {
    dateObj: ParticalDateObj;
    format: string;
    defaultTime?: string | string[];
    rangePosition?: (typeof RANGE_POSITION)[keyof typeof RANGE_POSITION];
}) => {
    const newDateObj = { ...dateObj };

    // FEATURE 支持填充其他格式
    if (!/d/.test(format)) {
        if (rangePosition === RANGE_POSITION.LEFT) {
            newDateObj.day = 1;
        } else {
            const date = dateObjToDate(dateObj);
            newDateObj.day = endOfMonth(date).getDate();
        }
    }

    return {
        ...newDateObj,
        ...getDefaultTime(defaultTime, rangePosition),
    } as DateObj;
};

export const getDefaultTime = (
    defaultTime?: string | string[],
    rangePosition?: (typeof RANGE_POSITION)[keyof typeof RANGE_POSITION],
    hasTime?: boolean,
) => {
    const time: {
        hour?: number;
        minute?: number;
        second?: number;
    } = {};
    if (typeof defaultTime === 'string') {
        Object.assign(time, transformTimeToDate(defaultTime));
    } else if (Array.isArray(defaultTime)) {
        if (rangePosition === RANGE_POSITION.LEFT) {
            Object.assign(time, transformTimeToDate(defaultTime[0]));
        } else {
            Object.assign(time, transformTimeToDate(defaultTime[1]));
        }
    } else if (!rangePosition && hasTime) {
        const date = new Date();

        time.hour = date.getHours();
        time.minute = date.getMinutes();
        time.second = date.getSeconds();
    } else if (rangePosition === RANGE_POSITION.RIGHT) {
        time.hour = 23;
        time.minute = 59;
        time.second = 59;
    } else {
        time.hour = 0;
        time.minute = 0;
        time.second = 0;
    }

    return time;
};

export const isBeyondRangeTime = (option: {
    currentDate: Date;
    format: string;
    flagDate?: Date;
    maxRange?: string;
}) => {
    if (!option.flagDate || !option.maxRange) return false;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const arr = option.maxRange.match(/(\d*)([MDY])/)!;
    const length = Number(arr[1]);
    const type = arr[2];

    let minDate: Date;
    let maxDate: Date;

    if (type === 'D') {
        // FEATURE: 后续采取 unicode token 标准(https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)，用 d
        minDate = new Date(option.flagDate);
        maxDate = new Date(option.flagDate);
        minDate.setDate(minDate.getDate() - length + 1);
        maxDate.setDate(maxDate.getDate() + length - 1);
    } else if (type === 'M') {
        // DEPRECATED 后续废弃对 M 和 Y 的支持
        minDate = new Date(option.flagDate);
        maxDate = new Date(option.flagDate);
        minDate.setMonth(minDate.getMonth() - length, maxDate.getDate() + 1);
        maxDate.setMonth(maxDate.getMonth() + length, maxDate.getDate() - 1);
    } else if (type === 'Y') {
        // FEATURE: 后续采取 unicode token 标准，用 y
        minDate = new Date(option.flagDate.getFullYear() + length, 0);
        maxDate = new Date(option.flagDate.getFullYear() - length, 0);
    }
    if (!(minDate || maxDate)) {
        return false;
    }

    return (
        contrastDate(option.currentDate, minDate, option.format) === -1 ||
        contrastDate(option.currentDate, maxDate, option.format) === 1
    );
};
