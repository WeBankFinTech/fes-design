import type { PropType } from 'vue';
import { PickerType } from './pickerHander';

export enum RANGE_POSITION {
    LEFT = 'left',
    RIGHT = 'right',
}

export enum SELECTED_STATUS {
    EMPTY,
    ONE,
    TWO,
}

export const YEAR_COUNT = 16;

export const COMMON_PROPS = {
    modelValue: {
        type: [Array, Number] as PropType<number | number[]>,
    },
    format: String,
    type: {
        type: String as PropType<PickerType>,
        default: PickerType.date,
    },
    minDate: {
        type: Date,
    },
    maxDate: {
        type: Date,
    },
    disabledDate: {
        type: Function as PropType<(date: Date) => boolean>,
        default: () => false,
    },
    disabledTime: {
        type: Function as PropType<
            (
                date: Date,
                rangePosition?: RANGE_POSITION,
                value?: Date | Date[],
            ) => boolean
        >,
        default: () => false,
    },
};

export const CALENDARS_PROPS = {
    control: {
        type: Boolean,
        default: false,
    },
    shortcuts: {
        type: Object,
    },
};

export const RANGE_PROPS = {
    maxRange: {
        // 7D七天， 1M一个月， 2Y两年
        type: String,
    },
};
