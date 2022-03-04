import { isNumber } from 'lodash-es';

import type { ParticalDateObj } from './interface';

export const isEmptyValue = (val: any) => {
    if (!val) return true;
    if (Array.isArray(val)) {
        return val.length === 0;
    }
    return false;
};

function timeFormat(date: null, format: string): null;
function timeFormat(date: number | Date, format: string): string;
function timeFormat(date: number | Date | null, format = 'YYYY-MM-DD') {
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
        YYYY: year,
        MM: dd(month + 1),
        MMMM: `${month + 1}月`,
        M: month + 1,
        DD: dd(day),
        D: day,
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
    return format.replace(/Y+|M+|D+|H+|h+|m+|s+|S+|Q/g, (str) =>
        String(map[str as keyof typeof map]),
    );
}

export { timeFormat };

export const contrastDate = (
    date1: number | Date,
    date2: number | Date,
    format = 'YYYY-MM-DD HH:mm:ss',
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

export function transformDateToTimestamp(
    date: ParticalDateObj,
    isFullMax = false,
) {
    if (!date) return null;
    if (isFullMax) {
        const month = date.month ?? 11;
        const maxDay = new Date(date.year, month + 1, 0).getDate();
        return new Date(
            date.year,
            date.month ?? 11,
            date.day ?? maxDay,
            date.hour ?? 23,
            date.minute ?? 59,
            date.second ?? 59,
            999,
        ).getTime();
    }
    return new Date(
        date.year,
        date.month ?? 0,
        date.day ?? 1,
        date.hour ?? 0,
        date.minute ?? 0,
        date.second ?? 0,
        0,
    ).getTime();
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

    if (/D/.test(format)) {
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
