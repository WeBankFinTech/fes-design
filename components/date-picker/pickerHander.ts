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
    getDateFromStr(val: string): Date;
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

export class DateRangePicker implements Picker {
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

export class DateTimeRangePicker implements Picker {
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
