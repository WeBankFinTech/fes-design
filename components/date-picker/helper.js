import { isNumber } from 'lodash-es';

export const isEmptyValue = (val) => {
    if (!val) return true;
    if (Array.isArray(val)) {
        return val.length === 0;
    }
    return false;
};

export const timeFormat = (date, format = 'YYYY-MM-DD') => {
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
    const dd = t => (`0${t}`).slice(-2);
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
    };
    return format.replace(/Y+|M+|D+|H+|h+|m+|s+|S+|Q/g, str => map[str]);
};

export const isSameDay = (date1, date2) => timeFormat(date1, 'YYYY-MM-DD') === timeFormat(date2, 'YYYY-MM-DD');


export const inOnePanel = (dates, format) => {
    const [start, end] = dates;
    if (start && end) {
        if (format.indexOf('D') !== -1) {
            if (timeFormat(start, 'YYYYMM') === timeFormat(end, 'YYYYMM')) {
                return true;
            }
        } else if (format.indexOf('M') !== -1) {
            if (start.getFullYear() === end.getFullYear()) {
                return true;
            }
        } else if (Number.parseInt(start.getFullYear() / 10) === Number.parseInt(end.getFullYear() / 10)) {
            return true;
        }
    }
    return false;
};

export const contrastDate = (date1, date2, format = 'YYYY-MM-DD HH:mm:ss') => {
    const t1 = timeFormat(date1, format);
    const t2 = timeFormat(date2, format);
    if (t1 > t2) return 1;
    if (t1 === t2) return 0;
    return -1;
};


export const isEqualDate = (val, dates, model = 'single') => {
    const emptyVal = isEmptyValue(val);
    const emptyDates = isEmptyValue(dates);
    if (emptyVal && emptyDates) return true;
    if ((emptyVal && !emptyDates) || (!emptyVal && emptyDates)) return false;
    if (model === 'single') {
        return contrastDate(new Date(dates), new Date(val)) === 0;
    }
    if (val.length !== dates.length) return false;
    return val.every((timestamp, i) => contrastDate(new Date(dates[i]), new Date(timestamp)) === 0);
};

export const parseDate = (date) => {
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

export const transformDateToTimestamp = (date, isFullMax = false) => {
    if (!date) return null;
    if (isFullMax) {
        const month = date.month ?? 11;
        const maxDay = new Date(date.year, month + 1, 0).getDate();
        return (new Date(date.year, date.month ?? 11, date.day ?? maxDay, date.hour ?? 23, date.minute ?? 59, date.second ?? 59, 999)).getTime();
    }
    return (new Date(date.year, date.month ?? 0, date.day ?? 1, date.hour ?? 0, date.minute ?? 0, date.second ?? 0, 0)).getTime();
};

export const padStartZero = (target, len = 2) => (`${target}`).padStart(len, '0');

export const getTimestampFromFormat = (date, format, isFullMax) => {
    date = date || new Date();
    const dateObj = {
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
        dateObj.month = Math.floor(date.getMonth() / 3) + 1;
    }

    return transformDateToTimestamp(dateObj, isFullMax);
};
