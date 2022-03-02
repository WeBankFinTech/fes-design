import type { PropType } from 'vue';

export const DATE_TYPE_CURRENT = {
    now: 'now',
    today: 'today',
    currentYear: 'currentYear',
    currentMonth: 'currentMonth',
    currentQuarter: 'currentQuarter',
};

export const DATE_TYPE = {
    date: {
        name: 'date',
        currentText: DATE_TYPE_CURRENT.today,
        format: 'YYYY-MM-DD',
        isRange: false,
        hasTime: false,
    },
    datetime: {
        name: 'datetime',
        currentText: DATE_TYPE_CURRENT.now,
        hasTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        isRange: false,
    },
    daterange: {
        name: 'daterange',
        currentText: '',
        isRange: true,
        format: 'YYYY-MM-DD',
        hasTime: false,
    },
    datetimerange: {
        name: 'datetimerange',
        currentText: '',
        isRange: true,
        hasTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
    },
    year: {
        name: 'year',
        currentText: DATE_TYPE_CURRENT.currentYear,
        format: 'YYYY',
        isRange: false,
        hasTime: false,
    },
    month: {
        name: 'month',
        currentText: DATE_TYPE_CURRENT.currentMonth,
        format: 'YYYY-MM',
        isRange: false,
        hasTime: false,
    },
    quarter: {
        name: 'quarter',
        currentText: DATE_TYPE_CURRENT.currentQuarter,
        format: 'YYYY-Q',
        isRange: false,
        hasTime: false,
    },
} as const;

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

export type DatePickerType = keyof typeof DATE_TYPE;

export const COMMON_PROPS = {
    modelValue: {
        type: [Array, Number] as PropType<number | number[]>,
    },
    format: String,
    type: {
        type: String as PropType<DatePickerType>,
        default: DATE_TYPE.date.name,
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
