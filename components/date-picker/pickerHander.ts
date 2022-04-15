import { isEffectiveDate } from './helper';

const DATE_TIME_REG = /^\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}$/;

export enum PickerType {
    date = 'date',
    datetime = 'datetime',
    daterange = 'daterange',
    datetimerange = 'datetimerange',
    year = 'year',
    month = 'month',
    quarter = 'quarter',
}

export interface Picker {
    name: string;
    confirmLang: string;
    placeholderLang: string | string[];
    format: string;
    isRange: boolean;
    hasTime: boolean;
    isEffectiveDate(val: string): boolean;
    getDateFromStr(val: string): Date;
}

export class DatePicker implements Picker {
    name = PickerType.date;
    confirmLang = 'datePicker.now';
    placeholderLang = 'datePicker.selectDate';
    format = 'YYYY-MM-DD';
    isRange = false;
    hasTime = false;
    isEffectiveDate(val: string): boolean {
        return isEffectiveDate(val);
    }
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class DateTimePicker implements Picker {
    name = PickerType.datetime;
    confirmLang = 'datePicker.today';
    placeholderLang = 'datePicker.selectDateTime';
    format = 'YYYY-MM-DD HH:mm:ss';
    isRange = false;
    hasTime = true;
    isEffectiveDate(val: string): boolean {
        return (
            DATE_TIME_REG.test(val) && !Number.isNaN(new Date(val).getTime())
        );
    }
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class DateRangePicker implements Picker {
    name = PickerType.daterange;
    confirmLang = '';
    placeholderLang = [
        'datePicker.selectStartDate',
        'datePicker.selectEndDate',
    ];
    format = 'YYYY-MM-DD';
    isRange = true;
    hasTime = false;
    isEffectiveDate(val: string): boolean {
        return isEffectiveDate(val);
    }
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class DateTimeRangePicker implements Picker {
    name = PickerType.datetimerange;
    confirmLang = '';
    placeholderLang = [
        'datePicker.selectStartDateTime',
        'datePicker.selectEndDateTime',
    ];
    format = 'YYYY-MM-DD HH:mm:ss';
    isRange = true;
    hasTime = true;
    isEffectiveDate(val: string): boolean {
        return (
            DATE_TIME_REG.test(val) && !Number.isNaN(new Date(val).getTime())
        );
    }
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class YearPicker implements Picker {
    name = PickerType.year;
    confirmLang = 'datePicker.currentYear';
    placeholderLang = 'datePicker.selectYear';
    format = 'YYYY';
    isRange = false;
    hasTime = false;
    isEffectiveDate(val: string): boolean {
        return /^\d{4}$/.test(val) && !Number.isNaN(new Date(val).getTime());
    }
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class MonthPicker implements Picker {
    name = PickerType.month;
    confirmLang = 'datePicker.currentMonth';
    placeholderLang = 'datePicker.selectMonth';
    format = 'YYYY-MM';
    isRange = false;
    hasTime = false;
    isEffectiveDate(val: string): boolean {
        return (
            /^\d{4}-\d{1,2}$/.test(val) &&
            !Number.isNaN(new Date(val).getTime())
        );
    }
    getDateFromStr(val: string): Date {
        return new Date(val);
    }
}

export class QuarterPicker implements Picker {
    name = PickerType.quarter;
    confirmLang = 'datePicker.currentQuarter';
    placeholderLang = 'datePicker.selectQuarter';
    format = 'YYYY-Q';
    isRange = false;
    hasTime = false;
    isEffectiveDate(val: string): boolean {
        return /^\d{4}-Q[1234]$/.test(val);
    }
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
        case PickerType.daterange:
            return new DateRangePicker();
        case PickerType.datetimerange:
            return new DateTimeRangePicker();
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
