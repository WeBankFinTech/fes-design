import { watch, watchEffect, ref, reactive, computed, Ref } from 'vue';
import { isNil } from 'lodash-es';
import { endOfMonth } from 'date-fns';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { useLocale } from '../config-provider/useLocale';
import { PickerType } from './pickerHandler';

import { RANGE_POSITION, SELECTED_STATUS, YEAR_COUNT } from './const';
import {
    parseDate,
    timeFormat,
    contrastDate,
    transformDateToTimestamp,
    transformTimeToDate,
    fillDate,
} from './helper';
import type { Picker } from './pickerHandler';

import type { CalendarProps } from './calendar.vue';
import type {
    DateObj,
    CalendarEmits,
    DayItem,
    UpdateSelectedDates,
} from './interface';

const prefixCls = getPrefixCls('calendar');
const WEEK_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

type UpdateCurrentDate = (date: Partial<DateObj>) => void;

export const useCurrentDate = (props: CalendarProps, emit: CalendarEmits) => {
    const currentDate = reactive(parseDate(props.activeDate));
    const [innerActiveDate, updateActiveDate] = useNormalModel(props, emit, {
        prop: 'activeDate',
    });

    const mergeCurrentDate = (date: Partial<DateObj>) => {
        Object.assign(currentDate, date);
        currentDate.day = 1;
    };

    const updateCurrentDate: UpdateCurrentDate = (date: Partial<DateObj>) => {
        mergeCurrentDate(date);
        updateActiveDate(transformDateToTimestamp(currentDate));
    };

    watch(innerActiveDate, () => {
        mergeCurrentDate(parseDate(innerActiveDate.value));
    });

    watch(
        () => props.modelValue,
        () => {
            if (props.modelValue?.length === 1 && !props.rangePosition) {
                updateCurrentDate(parseDate(props.modelValue[0]));
            }
        },
    );

    return {
        currentDate,
        updateCurrentDate,
    };
};

export const useSelectedDates = (
    props: CalendarProps,
    emit: (event: 'selectedDay' | 'change', ...args: any[]) => void,
    picker: Ref<Picker>,
) => {
    const selectedDates = ref<DateObj[]>([]);
    const updateRangeSelectedDates = (date: DateObj, index: number) => {
        if (
            (index === 0 &&
                transformDateToTimestamp(date) >
                    transformDateToTimestamp(selectedDates.value[1])) ||
            (index === 1 &&
                transformDateToTimestamp(date) <
                    transformDateToTimestamp(selectedDates.value[0]))
        ) {
            selectedDates.value = [date, { ...date }];
        } else {
            selectedDates.value.splice(index, 1, date);
        }
    };
    const updateSelectedDates: UpdateSelectedDates = (
        date,
        index,
        option = {},
    ) => {
        const newDate = Object.assign({}, selectedDates.value[index], date);
        if (
            picker.value.isRange &&
            (option.isTime || option.isDateInput) &&
            props.selectedStatus === SELECTED_STATUS.END
        ) {
            updateRangeSelectedDates(newDate, index);
        } else if (
            picker.value.isRange &&
            (!selectedDates.value.length ||
                props.selectedStatus === SELECTED_STATUS.END)
        ) {
            const anotherDate = fillDate({
                dateObj: newDate,
                format: picker.value.format,
                defaultTime: props.defaultTime,
                rangePosition:
                    props.rangePosition === RANGE_POSITION.LEFT
                        ? RANGE_POSITION.RIGHT
                        : RANGE_POSITION.LEFT,
            });
            if (props.rangePosition === RANGE_POSITION.LEFT) {
                selectedDates.value = [newDate, anotherDate];
            } else {
                selectedDates.value = [anotherDate, newDate];
            }
            emit('selectedDay');
        } else if (picker.value.name === PickerType.datemultiple) {
            const selectedDateIndex = selectedDates.value.findIndex((item) => {
                return (
                    item.year === newDate.year &&
                    item.month === newDate.month &&
                    item.day === newDate.day
                );
            });
            if (selectedDateIndex !== -1) {
                selectedDates.value.splice(selectedDateIndex, 1);
            } else {
                selectedDates.value.push(newDate);
            }
        } else if (!picker.value.isRange) {
            selectedDates.value = [newDate];
        } else {
            if (
                // 变更日期的时候，继承当前位置的时间
                transformDateToTimestamp(selectedDates.value[0]) >
                transformDateToTimestamp(newDate)
            ) {
                selectedDates.value.splice(
                    0,
                    1,
                    picker.value.getRangeSelectedDate(
                        newDate,
                        selectedDates.value[0],
                    ),
                );
            } else {
                selectedDates.value.splice(
                    1,
                    1,
                    picker.value.getRangeSelectedDate(
                        newDate,
                        selectedDates.value[1],
                    ),
                );
            }
            emit('selectedDay');
        }

        if (picker.value.isRange) {
            emit('change', [
                transformDateToTimestamp(selectedDates.value[0]),
                transformDateToTimestamp(selectedDates.value[1], true),
            ]);
        } else if (picker.value.name === PickerType.datemultiple) {
            emit(
                'change',
                selectedDates.value.map((item) => {
                    return transformDateToTimestamp(item);
                }),
            );
        } else {
            emit('change', [transformDateToTimestamp(selectedDates.value[0])]);
        }
    };

    watch(
        () => props.modelValue,
        () => {
            const dates = props.modelValue || [];
            selectedDates.value = dates.map((item) =>
                item ? parseDate(item) : null,
            );
        },
        {
            immediate: true,
        },
    );

    return {
        selectedDates,
        updateSelectedDates,
    };
};

export function useYear({
    props,
    selectedDates,
    updateSelectedDates,
    activeIndex,
    currentDate,
    updateCurrentDate,
}: {
    props: CalendarProps;
    selectedDates: Ref<DateObj[]>;
    updateSelectedDates: UpdateSelectedDates;
    activeIndex: Ref<number>;
    currentDate: DateObj;
    updateCurrentDate: UpdateCurrentDate;
}) {
    const isYearSelect = ref(false);
    // 年份相关
    watchEffect(() => {
        if (props.type === PickerType.year) {
            isYearSelect.value = true;
        }
    });
    const selectYear = (year: number) => {
        updateCurrentDate({
            year,
        });
        updateSelectedDates(
            {
                year,
            },
            activeIndex.value,
        );
    };

    const yearStart = computed(
        () => currentDate.year - (currentDate.year % YEAR_COUNT),
    );
    const yearEnd = computed(() => yearStart.value + YEAR_COUNT);
    const years = computed(() => {
        const arr = [];
        let start = yearStart.value;
        while (arr.length < 16) {
            arr.push(start++);
        }
        return arr;
    });

    const disabled = (year: number) => {
        const date = new Date(year, 0);
        return props.disabledDate && props.disabledDate(date, 'yyyy');
    };

    const isSelectedYear = (year: number) => {
        if (props.type === PickerType.year) {
            return !!selectedDates.value.find((item) => item?.year === year);
        }
        return false;
    };

    const yearCls = (year: number) => [
        `${prefixCls}-date`,
        disabled(year) && `${prefixCls}-date-disabled`,
        isSelectedYear(year) && `${prefixCls}-date-selected`,
        year === new Date().getFullYear() && [`${prefixCls}-date-now`],
    ];

    return {
        years,
        yearStart,
        yearEnd,
        selectYear,
        isYearSelect,
        yearCls,
    };
}

export function useCommonRange({
    props,
    selectedDates,
    picker,
}: {
    props: CalendarProps;
    selectedDates: Ref<DateObj[]>;
    picker: Ref<Picker>;
}) {
    const startDate = computed(
        () =>
            selectedDates.value[0] &&
            new Date(transformDateToTimestamp(selectedDates.value[0])),
    );
    const endDate = computed(
        () =>
            selectedDates.value[1] &&
            new Date(transformDateToTimestamp(selectedDates.value[1])),
    );

    // 样式计算
    const inRangeDate = (date: Date, format: string) => {
        if (picker.value.isRange && startDate.value && endDate.value) {
            return (
                contrastDate(date, startDate.value, format) === 1 &&
                contrastDate(date, endDate.value, format) === -1
            );
        }
        return false;
    };

    const completeRangeSelected = computed(
        () => props.selectedStatus === SELECTED_STATUS.END,
    );

    return {
        completeRangeSelected,
        inRangeDate,
    };
}

export function useMonth({
    props,
    selectedDates,
    updateSelectedDates,
    activeIndex,
    currentDate,
    updateCurrentDate,
    picker,
}: {
    props: CalendarProps;
    selectedDates: Ref<DateObj[]>;
    updateSelectedDates: UpdateSelectedDates;
    activeIndex: Ref<number>;
    currentDate: DateObj;
    updateCurrentDate: UpdateCurrentDate;
    picker: Ref<Picker>;
}) {
    // 月份相关
    const format = 'yyyy-MM';
    const isMonthSelect = computed(() => {
        return (
            props.type === PickerType.month ||
            props.type === PickerType.datemonthrange
        );
    });

    const selectMonth = (month: number) => {
        updateSelectedDates(
            {
                year: currentDate.year,
                month,
                day:
                    props.rangePosition === RANGE_POSITION.LEFT
                        ? 1
                        : endOfMonth(
                              new Date(currentDate.year, month, 1),
                          ).getDate(),
            },
            activeIndex.value,
        );
    };

    const monthToNext = () => {
        if (currentDate.month < 11) {
            updateCurrentDate({
                year: currentDate.year,
                month: currentDate.month + 1,
            });
        } else {
            updateCurrentDate({
                year: currentDate.year + 1,
                month: 0,
            });
        }
    };
    const monthToPre = () => {
        if (currentDate.month > 0) {
            updateCurrentDate({
                year: currentDate.year,
                month: currentDate.month - 1,
            });
        } else {
            updateCurrentDate({
                month: 11,
                year: currentDate.year - 1,
            });
        }
    };

    const disabled = (month: number) => {
        const date = new Date(currentDate.year, month);

        return props.disabledDate && props.disabledDate(date, format);
    };
    const isSelectedMonth = (month: number) => {
        if (isMonthSelect.value) {
            return selectedDates.value.findIndex(
                (item) =>
                    item &&
                    item.year === currentDate.year &&
                    item.month === month,
            );
        }
        return -1;
    };
    const { completeRangeSelected, inRangeDate } = useCommonRange({
        props,
        selectedDates,
        picker,
    });
    const monthCls = (month: number) => {
        const selectedIndex = isSelectedMonth(month);
        const date = new Date(currentDate.year, month);
        return {
            [`${prefixCls}-date`]: true,
            [`${prefixCls}-date-disabled`]: disabled(month),
            [`${prefixCls}-date-selected`]: selectedIndex !== -1,
            'is-start':
                picker.value.isRange &&
                completeRangeSelected.value &&
                selectedIndex === 0,
            'is-end':
                picker.value.isRange &&
                completeRangeSelected.value &&
                selectedIndex === 1,
            [`${prefixCls}-date-now`]:
                timeFormat(new Date(currentDate.year, month), format) ===
                timeFormat(new Date(), format),
            [`${prefixCls}-date-on`]: inRangeDate(date, format),
        };
    };

    return {
        isMonthSelect,
        selectMonth,
        monthToNext,
        monthToPre,
        monthCls,
    };
}

export function useDay({
    props,
    selectedDates,
    currentDate,
    picker,
}: {
    props: CalendarProps;
    selectedDates: Ref<DateObj[]>;
    currentDate: DateObj;
    picker: Ref<Picker>;
}) {
    const { t } = useLocale();

    // TODO 英文一个星期的第一天是 周日
    const weekFirstDay = ref(1);
    // 展示数据
    const weekNames = computed(() => {
        const weekFirstDayValue = weekFirstDay.value;
        return WEEK_NAMES.concat(WEEK_NAMES)
            .slice(weekFirstDayValue, weekFirstDayValue + 7)
            .map((_) => t(`datePicker.weeks.${_}`));
    });
    const isDaySelect = computed(() =>
        [
            PickerType.date,
            PickerType.datetime,
            PickerType.daterange,
            PickerType.datetimerange,
            PickerType.datemultiple,
        ].some((type) => props.type === type),
    );

    const days = computed(() => {
        const daysTemp = [];
        const { year, month } = currentDate;
        const time = new Date(year, month, 1);
        const weekFirstDayValue = weekFirstDay.value;
        time.setDate(0); // switch to the last day of last month
        let lastDay = time.getDate();
        const week = time.getDay() || 7;
        let count =
            weekFirstDayValue <= week
                ? week - weekFirstDayValue + 1
                : week + (7 - weekFirstDayValue + 1);
        while (count > 0 && count < 7) {
            daysTemp.push({
                day: lastDay - count + 1,
                year: month > 0 ? year : year - 1,
                month: month > 0 ? month - 1 : 11,
                pre: true,
            });
            count--;
        }
        time.setMonth(time.getMonth() + 2, 0); // switch to the last day of the current month
        lastDay = time.getDate();
        let i = 1;
        for (i = 1; i <= lastDay; i++) {
            daysTemp.push({
                day: i,
                year,
                month,
            });
        }
        for (i = 1; daysTemp.length < 42; i++) {
            daysTemp.push({
                day: i,
                year: month < 11 ? year : year + 1,
                month: month < 11 ? month + 1 : 0,
                next: true,
            });
        }
        return daysTemp;
    });

    const isSelected = (selectedDate: DateObj, dayItem: DayItem) =>
        dayItem.year === selectedDate?.year &&
        dayItem.month === selectedDate?.month &&
        dayItem.month === currentDate.month &&
        dayItem.day === selectedDate?.day;
    const findSelectedIndex = (dayItem: DayItem) =>
        selectedDates.value.findIndex((selectedDate) =>
            isSelected(selectedDate, dayItem),
        );

    const computedSelectedStart = (dayItem: DayItem) => {
        return (
            picker.value.isRange &&
            completeRangeSelected.value &&
            isSelected(selectedDates.value[0], dayItem)
        );
    };
    const computedSelectedEnd = (dayItem: DayItem) => {
        return (
            picker.value.isRange &&
            completeRangeSelected.value &&
            isSelected(selectedDates.value[1], dayItem)
        );
    };

    const { completeRangeSelected, inRangeDate } = useCommonRange({
        props,
        selectedDates,
        picker,
    });

    const dayCls = (item: DayItem) => {
        const format = 'yyyy-MM-dd';
        const { year, month } = item;
        const date = new Date(year, month, item.day);
        const selectedIndex = findSelectedIndex(item);
        return {
            [`${prefixCls}-date-out`]: item.pre || item.next,
            [`${prefixCls}-date`]: true,
            [`${prefixCls}-date-disabled`]:
                props.disabledDate && props.disabledDate(date, format),
            [`${prefixCls}-date-selected`]: selectedIndex !== -1,
            'is-start': computedSelectedStart(item),
            'is-end': computedSelectedEnd(item),
            [`${prefixCls}-date-now`]:
                timeFormat(date, format) === timeFormat(new Date(), format),
            [`${prefixCls}-date-on`]:
                inRangeDate(date, format) &&
                date.getMonth() === currentDate.month,
        };
    };

    return {
        days,
        isDaySelect,
        weekNames,
        dayCls,
    };
}

export const useQuarter = (
    props: CalendarProps,
    selectedDates: Ref<DateObj[]>,
    updateSelectedDates: UpdateSelectedDates,
    activeIndex: Ref<number>,
    currentDate: DateObj,
) => {
    const isQuarterSelect = computed(() => props.type === PickerType.quarter);

    type QuarterItem = {
        name: string;
        value: number;
    };

    const quarterList = [
        {
            name: 'Q1',
            value: 1,
        },
        {
            name: 'Q2',
            value: 2,
        },
        {
            name: 'Q3',
            value: 3,
        },
        {
            name: 'Q4',
            value: 4,
        },
    ];

    const selectQuarter = (item: QuarterItem) => {
        updateSelectedDates(
            {
                year: currentDate.year,
                month: (item.value - 1) * 3,
            },
            activeIndex.value,
        );
    };

    const isSelected = (item: QuarterItem) =>
        !!selectedDates.value.find(
            (selectedDate) =>
                selectedDate &&
                selectedDate.year === currentDate.year &&
                item.value === selectedDate.month / 3 + 1,
        );

    const isNow = (item: QuarterItem) => {
        const now = parseDate();
        return (
            now.year === currentDate.year &&
            Math.floor(now.month / 3) + 1 === item.value
        );
    };

    const quarterCls = (item: QuarterItem) => ({
        [`${prefixCls}-date`]: true,
        [`${prefixCls}-date-selected`]: isSelected(item),
        [`${prefixCls}-date-now`]: isNow(item),
    });
    return {
        isQuarterSelect,
        quarterList,
        selectQuarter,
        quarterCls,
    };
};

const transformDateToTime = (selectedDate: DateObj) => {
    if (!selectedDate) return '';
    const times = [];
    if (!isNil(selectedDate.hour)) {
        times.push(`${selectedDate.hour}`.padStart(2, '0'));
    }
    if (!isNil(selectedDate.minute)) {
        times.push(`${selectedDate.minute}`.padStart(2, '0'));
    }
    if (!isNil(selectedDate.second)) {
        times.push(`${selectedDate.second}`.padStart(2, '0'));
    }
    return times.join(':');
};

export const useTime = ({
    props,
    selectedDates,
    updateSelectedDates,
    activeIndex,
    picker,
}: {
    props: CalendarProps;
    selectedDates: Ref<DateObj[]>;
    updateSelectedDates: UpdateSelectedDates;
    activeIndex: Ref<number>;
    picker: Ref<Picker>;
}) => {
    const currentTime = ref('');
    watch(
        [selectedDates],
        () => {
            currentTime.value = transformDateToTime(
                selectedDates.value[activeIndex.value],
            );
        },
        {
            immediate: true,
            deep: true,
        },
    );

    const changeTime = (time: string) => {
        if (time) {
            const selectedDate = {
                ...selectedDates.value[activeIndex.value],
                ...transformTimeToDate(time),
            };
            if (!selectedDates.value[activeIndex.value]?.year) {
                const date = new Date();
                Object.assign(selectedDate, {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate(),
                });
            }
            updateSelectedDates(selectedDate, activeIndex.value, {
                isTime: true,
            });
        }
    };

    const innerDisabledTime = computed(() => {
        if (!props.disabledTime) return null;
        if (picker.value.isRange) {
            return props.disabledTime(
                new Date(
                    transformDateToTimestamp(
                        selectedDates.value[activeIndex.value],
                    ),
                ),
                props.rangePosition,
                selectedDates.value.map((val) => {
                    return new Date(transformDateToTimestamp(val));
                }),
            );
        }

        return props.disabledTime(
            new Date(transformDateToTimestamp(selectedDates.value[0])),
        );
    });

    return {
        currentTime,
        changeTime,
        innerDisabledTime,
    };
};
