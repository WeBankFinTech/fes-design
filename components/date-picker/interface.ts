import { DATE_TYPE, RANGE_POSITION } from './const';

export type DatePickerType = keyof typeof DATE_TYPE;

export type CommonProps = {
    modelValue?: number | number[];
    type: DatePickerType;
    minDate?: Date;
    maxDate?: Date;
    disabledDate?: (date: Date, format?: string) => boolean;
    disabledTime?: (date: Date) => boolean;
};

export type RangeProps = {
    maxRange: string;
};

export type DateObj = {
    year: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    quarter?: number;
};

export type CalendarProps = CommonProps & {
    rangePosition?: RANGE_POSITION;
    defaultDate?: number;
    visible?: boolean;
    visibleLeftArrow?: boolean;
    visibleRightArrow?: boolean;
};

export type CalendarEmits = {
    (e: 'change', val: DateObj[]): void;
    (e: 'changeCurrentDate', val: number | null): void;
};
