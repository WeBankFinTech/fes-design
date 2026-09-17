import {
    convertCalendarDateToDate,
    convertCalendarDateToUnixTime,
    convertDateToCalendarDate,
    convertUnixTimeToCalendarDate,
    generateCalendarDates,
    generateCalendarMonths,
    getToday,
    isSameDate,
    isSameMonth,
} from '../utils';

describe('calendar/utils 周/月计算分支补全', () => {
    test('generateCalendarDates 缺省 startDay=周一、weekNum 缺省 35 格', () => {
        // 2024-01-01 是周一：startDay 缺省取 1，前一月补位为 0 天
        const dates = generateCalendarDates({ year: 2024, month: 0, date: 1 });
        expect(dates.length).toBe(35);
        expect(dates[0]).toEqual({ year: 2024, month: 0, date: 1 });
        // 1 月 31 天后补 4 天进入 2 月（2024 闰年）
        expect(dates[34]).toEqual({ year: 2024, month: 1, date: 4 });
    });

    test('generateCalendarDates 指定 startDay/weekNum，且超格截断', () => {
        // startDay=0(周日)：2024-01-01 周一 → 补 1 天到 2023-12-31
        // weekNum=4 → 共 28 格；1+31-28 = 4 天超出 → 触发截断分支
        const dates = generateCalendarDates(
            { year: 2024, month: 0, date: 1 },
            { startDay: 0, weekNum: 4 },
        );
        expect(dates.length).toBe(28);
        expect(dates[0]).toEqual({ year: 2023, month: 11, date: 31 });
        // dates[1..31] 为 1 月 1..31，截断后最后一个索引 27 对应 1 月 27 日
        expect(dates[27]).toEqual({ year: 2024, month: 0, date: 27 });
    });

    test('generateCalendarDates 跨月补位：不足 35 格时填充下月日期', () => {
        // 2024-02-01 是周四（day=4）：补 3 天（1 月末）+ 29 天 = 32 格 → 再补 3 天到 3 月
        const dates = generateCalendarDates(
            { year: 2024, month: 1, date: 1 },
            { startDay: 1 },
        );
        expect(dates.length).toBe(35);
        expect(dates[31]).toEqual({ year: 2024, month: 1, date: 29 });
        expect(dates[32]).toEqual({ year: 2024, month: 2, date: 1 });
        expect(dates[34]).toEqual({ year: 2024, month: 2, date: 3 });
    });

    test('generateCalendarMonths 生成 12 个月、年份保留', () => {
        const months = generateCalendarMonths({ year: 2025, month: 0, date: 1 });
        expect(months).toHaveLength(12);
        expect(months[0]).toEqual({ month: 0, year: 2025, date: 1 });
        expect(months[11]).toEqual({ month: 11, year: 2025, date: 1 });
    });

    test('isSameDate / isSameMonth 语义', () => {
        const a = { year: 2024, month: 0, date: 15 };
        expect(isSameDate(a, { year: 2024, month: 0, date: 15 })).toBe(true);
        expect(isSameDate(a, { year: 2024, month: 0, date: 16 })).toBe(false);
        expect(isSameMonth(a, { year: 2024, month: 0, date: 1 })).toBe(true);
        expect(isSameMonth(a, { year: 2024, month: 1, date: 15 })).toBe(false);
    });

    test('Date/CalendarDate/UnixTime 互转语义', () => {
        expect(convertDateToCalendarDate(new Date(2024, 5, 15))).toEqual({
            year: 2024,
            month: 5,
            date: 15,
        });
        expect(
            convertCalendarDateToDate({ year: 2024, month: 5, date: 15 }).getTime(),
        ).toBe(new Date(2024, 5, 15).getTime());
        const unix = new Date(2024, 0, 1, 10, 20, 30, 40).getTime();
        expect(convertUnixTimeToCalendarDate(unix)).toEqual({
            year: 2024,
            month: 0,
            date: 1,
        });
        const result = new Date(
            convertCalendarDateToUnixTime({ year: 2024, month: 0, date: 1 }, unix),
        );
        expect(result.getFullYear()).toBe(2024);
        expect(result.getDate()).toBe(1);
        expect(result.getHours()).toBe(10);
        expect(result.getMinutes()).toBe(20);
        // 不传 precisionOffset 时取当前时分秒，保留日期部分
        const fallback = new Date(convertCalendarDateToUnixTime({ year: 2023, month: 6, date: 9 }));
        expect(fallback.getFullYear()).toBe(2023);
        expect(fallback.getMonth()).toBe(6);
        expect(fallback.getDate()).toBe(9);
    });

    test('getToday 返回当前 CalendarDate', () => {
        const now = new Date();
        expect(getToday()).toEqual({
            year: now.getFullYear(),
            month: now.getMonth(),
            date: now.getDate(),
        });
    });
});
