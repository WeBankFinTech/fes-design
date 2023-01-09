import { parseDate, pickTime } from './helper';
import type { DateObj } from './interface';

export const PickerType = {
    date: 'date',
    datetime: 'datetime',
    datemultiple: 'datemultiple',
    daterange: 'daterange',
    datetimerange: 'datetimerange',
    datemonthrange: 'datemonthrange',
    year: 'year',
    month: 'month',
    quarter: 'quarter',
} as const;

export interface Picker {
    name: string;
    confirmLang: string;
    placeholderLang: string | string[];
    format: string;
    isRange: boolean;
    hasTime: boolean;
    getDateFromStr(val: string): Date;
    getLeftActiveDate?(rightActiveDate: number): number;
    getRightActiveDate?(leftActiveDate: number): number;
    isInSamePanel?(left: number, right: number): boolean;
    getRangeSelectedDate?(date: Partial<DateObj>, preDate: DateObj): DateObj;
}

export class DatePicker implements Picker {
    name = PickerType.date;
    confirmLang = 'datePicker.now';
    placeholderLang = 'datePicker.selectDate';
    format = 'yyyy-MM-dd';
    isRange = false;
    hasTime = false;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}
export class DateMultiplePicker implements Picker {
    name = PickerType.datemultiple;
    confirmLang = '';
    placeholderLang = 'datePicker.selectDate';
    format = 'yyyy-MM-dd';
    isRange = false;
    hasTime = false;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class DateTimePicker implements Picker {
    name = PickerType.datetime;
    confirmLang = 'datePicker.today';
    placeholderLang = 'datePicker.selectDateTime';
    format = 'yyyy-MM-dd HH:mm:ss';
    isRange = false;
    hasTime = true;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

class DateRange {
    getLeftActiveDate(rightActiveDate: number) {
        const endDate = new Date(rightActiveDate);
        return endDate.setMonth(endDate.getMonth() - 1, 1);
    }
    getRightActiveDate(leftActiveDate: number) {
        const endDate = new Date(leftActiveDate);
        return endDate.setMonth(endDate.getMonth() + 1, 1);
    }
    isInSamePanel(left: number, right: number) {
        const leftDate = parseDate(left);
        const rightDate = parseDate(right);
        return (
            leftDate.year === rightDate.year &&
            leftDate.month === rightDate.month
        );
    }
    getRangeSelectedDate(date: Partial<DateObj>, preDate: DateObj) {
        return Object.assign(date, pickTime(preDate)) as DateObj;
    }
}

export class DateRangePicker extends DateRange implements Picker {
    name = PickerType.daterange;
    confirmLang = '';
    placeholderLang = [
        'datePicker.selectStartDate',
        'datePicker.selectEndDate',
    ];
    format = 'yyyy-MM-dd';
    isRange = true;
    hasTime = false;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class DateTimeRangePicker extends DateRange implements Picker {
    name = PickerType.datetimerange;
    confirmLang = '';
    placeholderLang = [
        'datePicker.selectStartDateTime',
        'datePicker.selectEndDateTime',
    ];
    format = 'yyyy-MM-dd HH:mm:ss';
    isRange = true;
    hasTime = true;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class DateMonthRangePicker implements Picker {
    name = PickerType.datemonthrange;
    confirmLang = '';
    placeholderLang = [
        'datePicker.selectStartDateMonth',
        'datePicker.selectEndDateMonth',
    ];
    format = 'yyyy-MM';
    isRange = true;
    hasTime = false;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
    getLeftActiveDate(rightActiveDate: number) {
        const endDate = new Date(rightActiveDate);
        return endDate.setFullYear(endDate.getFullYear() - 1, 0, 1);
    }
    getRightActiveDate(leftActiveDate: number) {
        const endDate = new Date(leftActiveDate);
        return endDate.setFullYear(endDate.getFullYear() + 1, 0, 1);
    }
    isInSamePanel(left: number, right: number) {
        const leftDate = parseDate(left);
        const rightDate = parseDate(right);
        return leftDate.year === rightDate.year;
    }
    getRangeSelectedDate(date: Partial<DateObj>, preDate: DateObj) {
        return Object.assign(
            date,
            {
                day: preDate.day,
            },
            pickTime(preDate),
        ) as DateObj;
    }
}

export class YearPicker implements Picker {
    name = PickerType.year;
    confirmLang = 'datePicker.currentYear';
    placeholderLang = 'datePicker.selectYear';
    format = 'yyyy';
    isRange = false;
    hasTime = false;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class MonthPicker implements Picker {
    name = PickerType.month;
    confirmLang = 'datePicker.currentMonth';
    placeholderLang = 'datePicker.selectMonth';
    format = 'yyyy-MM';
    isRange = false;
    hasTime = false;
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class QuarterPicker implements Picker {
    name = PickerType.quarter;
    confirmLang = 'datePicker.currentQuarter';
    placeholderLang = 'datePicker.selectQuarter';
    format = 'yyyy-QQQ';
    isRange = false;
    hasTime = false;
    getDateFromStr(val: string): Date {
        const [year, quarter] = val.match(/\d+/g);
        return new Date(Number(year), (Number(quarter) - 1) * 3);
    }
}

export function pickerFactory(type: string): Picker {
    switch (type) {
        case PickerType.date:
            return new DatePicker();
        case PickerType.datetime:
            return new DateTimePicker();
        case PickerType.datemultiple:
            return new DateMultiplePicker();
        case PickerType.daterange:
            return new DateRangePicker();
        case PickerType.datetimerange:
            return new DateTimeRangePicker();
        case PickerType.datemonthrange:
            return new DateMonthRangePicker();
        case PickerType.year:
            return new YearPicker();
        case PickerType.month:
            return new MonthPicker();
        case PickerType.quarter:
            return new QuarterPicker();
        default:
            return new DatePicker();
    }
}
