import { DATE_TYPE, RANGE_POSITION } from './const';

export type DatePickerType = keyof typeof DATE_TYPE;

export type DateObj = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    quarter?: number;
};

export type ParticalDateObj = Partial<Omit<DateObj, 'year'>> & {
    year: number;
};

export type CalendarEmits = {
    (e: 'change', val: number[]): void;
    (e: 'changeCurrentDate', val: number): void;
};

export type DayItem = {
    year: number;
    month: number;
    day: number;
    pre?: boolean;
    next?: boolean;
};
