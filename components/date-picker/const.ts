import type { PropType } from 'vue';
import type { PickerType } from './pickerHandler';

export const RANGE_POSITION = {
    LEFT: 'left',
    RIGHT: 'right',
} as const;

export enum SELECTED_STATUS {
    START,
    END,
}

export const YEAR_COUNT = 16;

export const COMMON_PROPS = {
    modelValue: {
        type: [Array, Number] as PropType<number | number[]>,
    },
    format: String,
    type: {
        type: String as PropType<keyof typeof PickerType>,
        default: 'date',
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
                rangePosition?: (typeof RANGE_POSITION)[keyof typeof RANGE_POSITION],
                value?: Date | Date[],
            ) => boolean
        >,
        default: () => false,
    },
    hourStep: Number,
    minuteStep: Number,
    secondStep: Number,
    defaultTime: [String, Array] as PropType<string | string[]>,
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
