export interface DateObj {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    quarter?: number;
}

export type ParticalDateObj = Partial<Omit<DateObj, 'year'>> & {
    year: number;
};

export type UpdateSelectedDates = (
    date: Partial<DateObj>,
    index: number,
    option?: {
        isTime?: boolean;
        isDateInput?: boolean;
    },
) => void;

export interface CalendarEmits {
    (e: 'change', val: number[]): void;
}

export interface DayItem {
    year: number;
    month: number;
    day: number;
    pre?: boolean;
    next?: boolean;
}
