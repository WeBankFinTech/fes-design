import { DATE_TYPE, RANGE_POSITION } from './const';

export type DatePickerType = keyof typeof DATE_TYPE;

export interface CommonProps {
    modelValue?: number | number[];
    type: DatePickerType;
    minDate?: Date;
    maxDate?: Date;
    disabledTime?: (
        date: Date,
        rangePosition?: RANGE_POSITION,
        value?: Date | Date[],
    ) => boolean;
}

export type RangeProps = {
    maxRange: string;
};

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

export interface CalendarProps extends CommonProps {
    modelValue: number[];
    rangePosition?: RANGE_POSITION;
    defaultDate?: number;
    visible?: boolean;
    visibleLeftArrow?: boolean;
    visibleRightArrow?: boolean;
    disabledDate?: (date: Date, format: string) => boolean | undefined;
}

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

export interface CalendarsProps extends CommonProps, RangeProps {
    disabledDate?: (date: Date) => boolean;
    visible: boolean;
    control: boolean;
    shortcuts: object;
}
