import { vi } from 'vitest';
import { isValid } from 'date-fns';
import {
    contrastDate,
    dateObjToDate,
    fillDate,
    getDefaultTime,
    getTimestampFromFormat,
    isBeyondRangeTime,
    isEmptyValue,
    padStartZero,
    parseDate,
    pickTime,
    strictParse,
    timeFormat,
    transformDateToTimestamp,
    transformTimeToDate,
} from '../helper';
import type {
    DateMonthRangePicker,
    DateRangePicker,
    DateTimePicker,
    QuarterPicker } from '../pickerHandler';
import {
    DatePicker,
    pickerFactory,
} from '../pickerHandler';
import { RANGE_POSITION } from '../const';

// ---------------- strictParse ----------------
describe('strictParse', () => {
    test('parses a well formatted date string', () => {
        const date = strictParse('2021-01-15', 'yyyy-MM-dd', new Date());
        expect(isValid(date)).toBe(true);
        expect(date.getFullYear()).toBe(2021);
        expect(date.getMonth()).toBe(0);
        expect(date.getDate()).toBe(15);
    });

    test('parses a datetime string', () => {
        const date = strictParse(
            '2021-01-15 10:20:30',
            'yyyy-MM-dd HH:mm:ss',
            new Date(),
        );
        expect(isValid(date)).toBe(true);
        expect(date.getHours()).toBe(10);
        expect(date.getMinutes()).toBe(20);
        expect(date.getSeconds()).toBe(30);
    });

    test('rejects a string not strictly matching the pattern', () => {
        // date-fns 可以宽泛解析 '2021-1-1'，但回显格式不一致时应判为非法
        const date = strictParse('2021-1-1', 'yyyy-MM-dd', new Date());
        expect(isValid(date)).toBe(false);
        expect(Number.isNaN(date.getTime())).toBe(true);
    });

    test('rejects an invalid month', () => {
        const date = strictParse('2021-13-01', 'yyyy-MM-dd', new Date());
        expect(isValid(date)).toBe(false);
    });

    test('rejects a totally invalid string', () => {
        const date = strictParse('abc', 'yyyy-MM-dd', new Date());
        expect(isValid(date)).toBe(false);
    });
});

// ---------------- isEmptyValue ----------------
describe('isEmptyValue', () => {
    test('falsy values are empty', () => {
        expect(isEmptyValue(null)).toBe(true);
        expect(isEmptyValue(undefined)).toBe(true);
        expect(isEmptyValue(0)).toBe(true);
        expect(isEmptyValue('')).toBe(true);
    });

    test('empty array is empty', () => {
        expect(isEmptyValue([])).toBe(true);
    });

    test('non-empty array is not empty', () => {
        expect(isEmptyValue([Date.now()])).toBe(false);
    });

    test('other truthy values are not empty', () => {
        expect(isEmptyValue(Date.now())).toBe(false);
        expect(isEmptyValue({})).toBe(false);
    });
});

// ---------------- timeFormat ----------------
describe('timeFormat', () => {
    test('formats a date', () => {
        expect(
            timeFormat(new Date(2021, 0, 5, 14, 3, 9), 'yyyy-MM-dd HH:mm:ss'),
        ).toBe('2021-01-05 14:03:09');
    });

    test('formats a timestamp', () => {
        expect(
            timeFormat(new Date(2021, 0, 5).getTime(), 'yyyy-MM-dd'),
        ).toBe('2021-01-05');
    });

    test('null returns null', () => {
        expect(timeFormat(null, 'yyyy-MM-dd')).toBe(null);
    });

    test('single M/d/H/m/s tokens are not zero padded', () => {
        expect(timeFormat(new Date(2021, 0, 5, 4, 3, 9), 'yyyy-M-d H:m:s'))
            .toBe('2021-1-5 4:3:9');
    });

    test('hh converts to 12 hours', () => {
        expect(timeFormat(new Date(2021, 0, 5, 0, 5, 9), 'hh:mm:ss'))
            .toBe('12:05:09');
        expect(timeFormat(new Date(2021, 0, 5, 15, 5, 9), 'hh:mm:ss'))
            .toBe('03:05:09');
    });

    test('MMMM renders chinese month', () => {
        expect(timeFormat(new Date(2021, 8, 5), 'MMMM yyyy')).toBe('9月 2021');
    });

    test('Q renders quarter', () => {
        expect(timeFormat(new Date(2021, 8, 5), 'yyyy-MM Q')).toBe(
            '2021-09 Q3',
        );
        expect(timeFormat(new Date(2021, 0, 5), 'yyyy Q')).toBe('2021 Q1');
    });

    test('S renders milliseconds', () => {
        expect(timeFormat(new Date(2021, 0, 5, 0, 0, 0, 123), 'S')).toBe(
            '123',
        );
    });
});

// ---------------- contrastDate ----------------
describe('contrastDate', () => {
    test('returns -1 when date1 is before date2', () => {
        expect(
            contrastDate(
                new Date(2021, 0, 1),
                new Date(2021, 0, 2),
                'yyyy-MM-dd',
            ),
        ).toBe(-1);
    });

    test('returns 1 when date1 is after date2', () => {
        expect(
            contrastDate(
                new Date(2021, 0, 3),
                new Date(2021, 0, 2),
                'yyyy-MM-dd',
            ),
        ).toBe(1);
    });

    test('returns 0 at format precision', () => {
        // 同一天不同时刻，按天比较相等
        expect(
            contrastDate(
                new Date(2021, 0, 2, 8),
                new Date(2021, 0, 2, 20),
                'yyyy-MM-dd',
            ),
        ).toBe(0);
        // 默认格式精确到秒，则不等
        expect(
            contrastDate(new Date(2021, 0, 2, 8), new Date(2021, 0, 2, 20)),
        ).toBe(-1);
    });
});

// ---------------- parseDate / pickTime ----------------
describe('parseDate', () => {
    test('splits a date into parts', () => {
        expect(parseDate(new Date(2021, 5, 15, 8, 30, 20))).toEqual({
            year: 2021,
            month: 5,
            day: 15,
            hour: 8,
            minute: 30,
            second: 20,
        });
    });

    test('defaults to now', () => {
        const now = new Date();
        const dateObj = parseDate();
        expect(dateObj.year).toBe(now.getFullYear());
        expect(dateObj.month).toBe(now.getMonth());
        expect(dateObj.day).toBe(now.getDate());
    });
});

describe('pickTime', () => {
    test('picks only time parts', () => {
        expect(
            pickTime({
                year: 2021,
                month: 0,
                day: 2,
                hour: 9,
                minute: 8,
                second: 7,
            } as any),
        ).toEqual({ hour: 9, minute: 8, second: 7 });
    });
});

// ---------------- dateObjToDate / transformDateToTimestamp ----------------
describe('dateObjToDate', () => {
    test('builds a date from parts', () => {
        expect(dateObjToDate({ year: 2021, month: 0, day: 15 })).toEqual(
            new Date(2021, 0, 15),
        );
    });

    test('defaults month to January and day to 1', () => {
        expect(dateObjToDate({ year: 2021 })).toEqual(new Date(2021, 0, 1));
    });

    test('converts quarter to month', () => {
        expect(dateObjToDate({ year: 2021, quarter: 2 })).toEqual(
            new Date(2021, 3, 1),
        );
    });

    test('isFullMax returns the end of month', () => {
        expect(dateObjToDate({ year: 2021, month: 1 }, true)).toEqual(
            new Date(2021, 1, 28, 23, 59, 59, 999),
        );
        expect(dateObjToDate({ year: 2020, month: 1 }, true)).toEqual(
            new Date(2020, 1, 29, 23, 59, 59, 999),
        );
    });

    test('null returns null', () => {
        expect(dateObjToDate(null)).toBe(null);
    });
});

describe('transformDateToTimestamp', () => {
    test('returns the timestamp of the built date', () => {
        expect(
            transformDateToTimestamp({ year: 2021, month: 0, day: 15 }),
        ).toBe(new Date(2021, 0, 15).getTime());
    });

    test('isFullMax returns the end of month timestamp', () => {
        expect(transformDateToTimestamp({ year: 2021, month: 4 }, true)).toBe(
            new Date(2021, 4, 31, 23, 59, 59, 999).getTime(),
        );
    });

    test('null returns null', () => {
        expect(transformDateToTimestamp(null)).toBe(null);
    });
});

// ---------------- padStartZero ----------------
describe('padStartZero', () => {
    test('pads numbers to 2 digits by default', () => {
        expect(padStartZero(5)).toBe('05');
        expect(padStartZero(15)).toBe('15');
    });

    test('supports custom length', () => {
        expect(padStartZero(3, 5)).toBe('00003');
    });
});

// ---------------- getTimestampFromFormat ----------------
describe('getTimestampFromFormat', () => {
    const date = new Date(2021, 5, 15, 10, 30, 20);

    test('keeps only parts present in the format', () => {
        expect(getTimestampFromFormat(date, 'yyyy-MM-dd')).toBe(
            new Date(2021, 5, 15).getTime(),
        );
        expect(getTimestampFromFormat(date, 'yyyy-MM')).toBe(
            new Date(2021, 5, 1).getTime(),
        );
        expect(getTimestampFromFormat(date, 'yyyy')).toBe(
            new Date(2021, 0, 1).getTime(),
        );
    });

    test('isFullMax fills the end of the period', () => {
        expect(getTimestampFromFormat(date, 'yyyy-MM', true)).toBe(
            new Date(2021, 5, 30, 23, 59, 59, 999).getTime(),
        );
        expect(getTimestampFromFormat(date, 'yyyy', true)).toBe(
            new Date(2021, 11, 31, 23, 59, 59, 999).getTime(),
        );
    });

    test('quarter format resolves to the first month of the quarter', () => {
        expect(getTimestampFromFormat(date, 'yyyy-QQQ')).toBe(
            new Date(2021, 3, 1).getTime(),
        );
    });

    test('null date falls back to now', () => {
        const before = new Date();
        const ts = getTimestampFromFormat(null, 'yyyy-MM-dd');
        const after = new Date();
        expect(ts).toBeGreaterThanOrEqual(
            new Date(
                before.getFullYear(),
                before.getMonth(),
                before.getDate(),
            ).getTime(),
        );
        expect(ts).toBeLessThanOrEqual(
            new Date(
                after.getFullYear(),
                after.getMonth(),
                after.getDate(),
            ).getTime(),
        );
    });
});

// ---------------- transformTimeToDate ----------------
describe('transformTimeToDate', () => {
    test('parses HH:mm:ss', () => {
        expect(transformTimeToDate('12:30:45')).toEqual({
            hour: 12,
            minute: 30,
            second: 45,
        });
    });

    test('falls back to 00:00:00 with a warning for invalid input', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(transformTimeToDate('12:30')).toEqual({
            hour: 0,
            minute: 0,
            second: 0,
        });
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });
});

// ---------------- fillDate ----------------
describe('fillDate', () => {
    test('fills the end of month when format has no day and no range position', () => {
        expect(
            fillDate({ dateObj: { year: 2021, month: 4 }, format: 'yyyy-MM' }),
        ).toEqual({
            year: 2021,
            month: 4,
            day: 31,
            hour: 0,
            minute: 0,
            second: 0,
        });
    });

    test('fills day 1 for the left range position', () => {
        expect(
            fillDate({
                dateObj: { year: 2021, month: 4 },
                format: 'yyyy-MM',
                rangePosition: RANGE_POSITION.LEFT,
            }),
        ).toEqual({
            year: 2021,
            month: 4,
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
        });
    });

    test('merges defaultTime', () => {
        expect(
            fillDate({
                dateObj: { year: 2021, month: 4 },
                format: 'yyyy-MM',
                defaultTime: '12:30:45',
            }),
        ).toEqual({
            year: 2021,
            month: 4,
            day: 31,
            hour: 12,
            minute: 30,
            second: 45,
        });
    });
});

// ---------------- getDefaultTime ----------------
describe('getDefaultTime', () => {
    test('string defaultTime', () => {
        expect(getDefaultTime('10:20:30')).toEqual({
            hour: 10,
            minute: 20,
            second: 30,
        });
    });

    test('array defaultTime picks by range position', () => {
        expect(
            getDefaultTime(['08:00:00', '23:30:00'], RANGE_POSITION.LEFT),
        ).toEqual({ hour: 8, minute: 0, second: 0 });
        expect(
            getDefaultTime(['08:00:00', '23:30:00'], RANGE_POSITION.RIGHT),
        ).toEqual({ hour: 23, minute: 30, second: 0 });
    });

    test('defaults to zeros', () => {
        expect(getDefaultTime()).toEqual({ hour: 0, minute: 0, second: 0 });
    });

    test('right position without defaultTime ends the day', () => {
        expect(getDefaultTime(undefined, RANGE_POSITION.RIGHT)).toEqual({
            hour: 23,
            minute: 59,
            second: 59,
        });
    });

    test('hasTime uses current time', () => {
        const before = new Date();
        const time = getDefaultTime(undefined, undefined, true);
        expect(time.hour).toBeGreaterThanOrEqual(before.getHours());
        expect(time.minute).toBeGreaterThanOrEqual(0);
        expect(time.second).toBeGreaterThanOrEqual(0);
    });
});

// ---------------- isBeyondRangeTime ----------------
describe('isBeyondRangeTime', () => {
    const flagDate = new Date(2021, 5, 15);

    test('no flagDate or maxRange returns false', () => {
        expect(
            isBeyondRangeTime({
                currentDate: new Date(2099, 0, 1),
                format: 'yyyy-MM-dd',
            }),
        ).toBe(false);
        expect(
            isBeyondRangeTime({
                currentDate: new Date(2099, 0, 1),
                format: 'yyyy-MM-dd',
                flagDate,
            }),
        ).toBe(false);
    });

    test('dates inside the day range are allowed', () => {
        expect(
            isBeyondRangeTime({
                currentDate: new Date(2021, 5, 15),
                format: 'yyyy-MM-dd',
                flagDate,
                maxRange: '7D',
            }),
        ).toBe(false);
        expect(
            isBeyondRangeTime({
                currentDate: new Date(2021, 5, 21),
                format: 'yyyy-MM-dd',
                flagDate,
                maxRange: '7D',
            }),
        ).toBe(false);
        expect(
            isBeyondRangeTime({
                currentDate: new Date(2021, 5, 9),
                format: 'yyyy-MM-dd',
                flagDate,
                maxRange: '7D',
            }),
        ).toBe(false);
    });

    test('dates outside the day range are rejected', () => {
        expect(
            isBeyondRangeTime({
                currentDate: new Date(2021, 5, 22),
                format: 'yyyy-MM-dd',
                flagDate,
                maxRange: '7D',
            }),
        ).toBe(true);
        expect(
            isBeyondRangeTime({
                currentDate: new Date(2021, 5, 8),
                format: 'yyyy-MM-dd',
                flagDate,
                maxRange: '7D',
            }),
        ).toBe(true);
    });
});

// ---------------- pickerHandler ----------------
describe('pickerFactory', () => {
    test('creates a date picker by default', () => {
        const picker = pickerFactory('unknown-type');
        expect(picker).toBeInstanceOf(DatePicker);
        expect(picker.name).toBe('date');
        expect(picker.format).toBe('yyyy-MM-dd');
        expect(picker.isRange).toBe(false);
        expect(picker.hasTime).toBe(false);
        expect(picker.placeholderLang).toBe('datePicker.selectDate');
    });

    test('date picker parses str with new Date', () => {
        const picker = pickerFactory('date');
        expect(picker.getDateFromStr('2021-01-15')).toEqual(
            new Date('2021-01-15'),
        );
    });

    test('datetime picker has time', () => {
        const picker = pickerFactory('datetime') as DateTimePicker;
        expect(picker.format).toBe('yyyy-MM-dd HH:mm:ss');
        expect(picker.hasTime).toBe(true);
        expect(picker.isRange).toBe(false);
        expect(picker.placeholderLang).toBe('datePicker.selectDateTime');
    });

    test('year picker format', () => {
        expect(pickerFactory('year').format).toBe('yyyy');
        expect(pickerFactory('year').placeholderLang).toBe(
            'datePicker.selectYear',
        );
    });

    test('month picker format', () => {
        expect(pickerFactory('month').format).toBe('yyyy-MM');
        expect(pickerFactory('month').placeholderLang).toBe(
            'datePicker.selectMonth',
        );
    });

    test('quarter picker resolves quarter string to month', () => {
        const picker = pickerFactory('quarter') as QuarterPicker;
        expect(picker.format).toBe('yyyy-QQQ');
        const date = picker.getDateFromStr('2021 Q3');
        expect(date.getFullYear()).toBe(2021);
        expect(date.getMonth()).toBe(6);
    });

    test('daterange picker is range with month navigation helpers', () => {
        const picker = pickerFactory('daterange') as DateRangePicker;
        expect(picker.isRange).toBe(true);
        expect(picker.hasTime).toBe(false);
        expect(picker.placeholderLang).toEqual([
            'datePicker.selectStartDate',
            'datePicker.selectEndDate',
        ]);
        const current = new Date(2021, 5, 15).getTime();
        expect(picker.getLeftActiveDate(current)).toBe(
            new Date(2021, 4, 1).getTime(),
        );
        expect(picker.getRightActiveDate(current)).toBe(
            new Date(2021, 6, 1).getTime(),
        );
        expect(picker.isInSamePanel(current, new Date(2021, 5, 20).getTime()))
            .toBe(true);
        expect(picker.isInSamePanel(current, new Date(2021, 6, 1).getTime()))
            .toBe(false);
    });

    test('daterange picker keeps time of the previous selection', () => {
        const picker = pickerFactory('daterange');
        const next = picker.getRangeSelectedDate(
            { year: 2021, month: 5, day: 20 },
            {
                year: 2021,
                month: 5,
                day: 10,
                hour: 10,
                minute: 20,
                second: 30,
            } as any,
        );
        expect(next).toEqual({
            year: 2021,
            month: 5,
            day: 20,
            hour: 10,
            minute: 20,
            second: 30,
        });
    });

    test('datetimerange picker has time and range format', () => {
        const picker = pickerFactory('datetimerange');
        expect(picker.isRange).toBe(true);
        expect(picker.hasTime).toBe(true);
        expect(picker.format).toBe('yyyy-MM-dd HH:mm:ss');
    });

    test('datemonthrange picker navigates by year', () => {
        const picker = pickerFactory('datemonthrange') as DateMonthRangePicker;
        expect(picker.format).toBe('yyyy-MM');
        expect(picker.isRange).toBe(true);
        const current = new Date(2021, 5, 1).getTime();
        expect(picker.getLeftActiveDate(current)).toBe(
            new Date(2020, 0, 1).getTime(),
        );
        expect(picker.getRightActiveDate(current)).toBe(
            new Date(2022, 0, 1).getTime(),
        );
        expect(picker.isInSamePanel(current, new Date(2021, 11, 1).getTime()))
            .toBe(true);
        expect(picker.isInSamePanel(current, new Date(2022, 0, 1).getTime()))
            .toBe(false);
    });
});
