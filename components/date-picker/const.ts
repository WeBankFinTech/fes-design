export const DATE_TYPE = {
    date: {
        name: 'date',
        currentText: '今天',
        format: 'YYYY-MM-DD',
        isRange: false,
        hasTime: false,
    },
    datetime: {
        name: 'datetime',
        currentText: '此刻',
        hasTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        isRange: false,
    },
    daterange: {
        name: 'daterange',
        currentText: '今天',
        isRange: true,
        format: 'YYYY-MM-DD',
        hasTime: false,
    },
    datetimerange: {
        name: 'datetimerange',
        currentText: '此刻',
        isRange: true,
        hasTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
    },
    year: {
        name: 'year',
        currentText: '今年',
        format: 'YYYY',
        isRange: false,
        hasTime: false,
    },
    month: {
        name: 'month',
        currentText: '本月',
        format: 'YYYY-MM',
        isRange: false,
        hasTime: false,
    },
    quarter: {
        name: 'quarter',
        currentText: '本季度',
        format: 'YYYY-Q',
        isRange: false,
        hasTime: false,
    },
} as const;

export enum RANGE_POSITION {
    LEFT = 'left',
    RIGHT = 'right',
}

export const YEAR_COUNT = 16;

export const COMMON_PROPS = {
    modelValue: {
        type: [Array, Number],
    },
    type: {
        default: DATE_TYPE.date.name,
    },
    minDate: {
        type: Date,
    },
    maxDate: {
        type: Date,
    },
    disabledDate: {
        type: Function,
        default: () => false,
    },
    disabledTime: {
        type: Function,
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
