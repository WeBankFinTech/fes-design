import { DATE_TYPE } from './const';

export type CommonProps = {
    modelValue: number | number[];
    type: keyof typeof DATE_TYPE;
    minDate: Date;
    maxDate: Date;
    disabledDate: () => boolean;
    disabledTime: () => boolean;
};

export type RangeProps = {
    maxRange: string;
};
