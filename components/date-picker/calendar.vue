<template>
    <div :class="prefixCls">
        <div v-if="pickerRef.hasTime" :class="`${prefixCls}-input`">
            <InputInner
                :modelValue="inputDate"
                :class="`${prefixCls}-input-date`"
                :placeholder="t('datePicker.selectDate')"
                @input="handleDateInput"
                @blur="handleDateInputBlur"
            />
            <TimePicker
                :inputClass="`${prefixCls}-input-time`"
                :modelValue="currentTime"
                v-bind="innerDisabledTime"
                :showSuffix="false"
                :clearable="false"
                :hourStep="hourStep"
                :minuteStep="minuteStep"
                :secondStep="secondStep"
                :appendToContainer="false"
                :placeholder="t('datePicker.selectTime')"
                @change="changeTime"
            />
        </div>
        <div :class="`${prefixCls}-head`" @mousedown.prevent>
            <div :class="`${prefixCls}-head-left`">
                <DoubleLeftOutlined
                    :class="`${prefixCls}-icon`"
                    @click="yearToPre"
                />
                <LeftOutlined
                    v-show="visibleLeftSingleArrow"
                    :class="`${prefixCls}-icon`"
                    @click="monthToPre"
                />
            </div>
            <div :class="`${prefixCls}-head-middle`">
                <span :class="`${prefixCls}-head-middle-item`">
                    {{ currentDate.year }}{{ t('datePicker.year') }}
                </span>
                <span
                    v-show="!isYearSelect && !isMonthSelect && !isQuarterSelect"
                    :class="`${prefixCls}-head-middle-item`"
                >
                    {{ t(`datePicker.month${currentDate.month + 1}`) }}
                </span>
            </div>
            <div :class="`${prefixCls}-head-right`">
                <RightOutlined
                    v-show="visibleRightSingleArrow"
                    :class="`${prefixCls}-icon`"
                    @click="monthToNext"
                />
                <DoubleRightOutlined
                    :class="`${prefixCls}-icon`"
                    @click="yearToNext"
                />
            </div>
        </div>
        <div :class="`${prefixCls}-body`" @mousedown.prevent>
            <div v-if="isDaySelect" :class="`${prefixCls}-days`">
                <span
                    v-for="weekName in weekNames"
                    :key="weekName"
                    :class="`${prefixCls}-week`"
                >
                    {{ weekName }}
                </span>
                <span
                    v-for="(item, i) in days"
                    :key="i"
                    :class="dayCls(item)"
                    @click="isNotDisabled($event) && selectedDay(item)"
                >
                    {{ item.day }}
                </span>
            </div>
            <div v-if="isMonthSelect" :class="`${prefixCls}-months`">
                <span
                    v-for="(monthName, i) in MONTHS_NAMES"
                    :key="i"
                    :class="monthCls(i)"
                    @click="isNotDisabled($event) && selectMonth(i)"
                >
                    {{ t(`datePicker.months.${monthName}`) }}
                </span>
            </div>
            <div v-if="isYearSelect" :class="`${prefixCls}-years`">
                <span
                    v-for="(year, index) in years"
                    :key="index"
                    :class="yearCls(year)"
                    @click="isNotDisabled($event) && selectYear(year)"
                >
                    {{ year }}
                </span>
            </div>
            <div v-if="isQuarterSelect" :class="`${prefixCls}-quarters`">
                <span
                    v-for="item in quarterList"
                    :key="item.value"
                    :class="quarterCls(item)"
                    @click="isNotDisabled($event) && selectQuarter(item)"
                >
                    {{ t(`datePicker.quarters.${item.name}`) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    ref,
    watch,
    computed,
    defineComponent,
    PropType,
    ExtractPropTypes,
    Ref,
} from 'vue';
import { isValid, format } from 'date-fns';
import {
    LeftOutlined,
    RightOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from '../icon';
import TimePicker from '../time-picker';
import InputInner from '../input/inputInner.vue';
import getPrefixCls from '../_util/getPrefixCls';

import { useLocale } from '../config-provider/useLocale';
import {
    parseDate,
    strictParse,
    transformDateToTimestamp,
    getDefaultTime,
} from './helper';
import {
    RANGE_POSITION,
    COMMON_PROPS,
    YEAR_COUNT,
    SELECTED_STATUS,
} from './const';

import {
    useCurrentDate,
    useSelectedDates,
    useYear,
    useMonth,
    useDay,
    useQuarter,
    useTime,
} from './useCalendar';

import { pickerFactory } from './pickerHandler';
import type { DayItem, DateObj, UpdateSelectedDates } from './interface';
import type { Picker } from './pickerHandler';

const prefixCls = getPrefixCls('calendar');

const MONTHS_NAMES = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
];

const calendarProps = {
    ...COMMON_PROPS,
    rangePosition: {
        type: String as PropType<
            (typeof RANGE_POSITION)[keyof typeof RANGE_POSITION]
        >,
    },
    modelValue: Array as PropType<number[]>,
    activeDate: Number,
    selectedStatus: Number as PropType<SELECTED_STATUS>,
    disabledDate: {
        type: Function as PropType<
            (date: Date, format: string, flagDate?: Date) => boolean | undefined
        >,
    },
} as const;

export type CalendarProps = Partial<ExtractPropTypes<typeof calendarProps>>;

function useDateInput({
    props,
    selectedDates,
    updateSelectedDates,
    updateCurrentDate,
    picker,
}: {
    props: CalendarProps;
    selectedDates: Ref<DateObj[]>;
    updateSelectedDates: UpdateSelectedDates;
    updateCurrentDate: (date: Partial<DateObj>) => void;
    picker: Ref<Picker>;
}) {
    const inputDate = ref<string>();
    let cacheValidInputDate = '';
    const currentIndex = computed(() => {
        if (
            picker.value.isRange &&
            props.rangePosition === RANGE_POSITION.RIGHT
        ) {
            return 1;
        }
        return 0;
    });
    const getDateStr = (i: number) => {
        return selectedDates.value[i]
            ? format(
                  transformDateToTimestamp(selectedDates.value[i]),
                  'yyyy-MM-dd',
              )
            : '';
    };
    watch(
        selectedDates,
        () => {
            cacheValidInputDate = getDateStr(currentIndex.value);
            inputDate.value = cacheValidInputDate;
        },
        {
            immediate: true,
        },
    );

    const handleDateInput = (val: string) => {
        inputDate.value = val;
        const date = strictParse(val, 'yyyy-MM-dd', new Date());
        const anotherDate = selectedDates.value[(currentIndex.value + 1) % 2];
        if (
            isValid(date) &&
            !props.disabledDate?.(
                date,
                'yyyy-MM-dd',
                anotherDate && new Date(transformDateToTimestamp(anotherDate)),
            )
        ) {
            const dateObj = parseDate(date);
            cacheValidInputDate = val;
            // 在同一面板，不更新 current date
            if (
                anotherDate &&
                !(
                    anotherDate.year === dateObj.year &&
                    anotherDate.month === dateObj.month
                )
            ) {
                updateCurrentDate(dateObj);
            }
            updateSelectedDates(
                {
                    ...selectedDates.value[currentIndex.value],
                    year: dateObj.year,
                    month: dateObj.month,
                    day: dateObj.day,
                },
                currentIndex.value,
                {
                    isDateInput: true,
                },
            );
        }
    };
    const handleDateInputBlur = () => {
        if (inputDate.value !== cacheValidInputDate) {
            inputDate.value = cacheValidInputDate;
        }
    };

    return {
        inputDate,
        handleDateInput,
        handleDateInputBlur,
    };
}

export default defineComponent({
    name: 'FCalendar',
    components: {
        LeftOutlined,
        RightOutlined,
        DoubleLeftOutlined,
        DoubleRightOutlined,
        InputInner,
        TimePicker,
    },
    props: calendarProps,
    emits: ['change', 'selectedDay', 'update:activeDate'],
    setup(props, { emit }) {
        const pickerRef = computed(() => {
            return pickerFactory(props.type);
        });
        const { currentDate, updateCurrentDate } = useCurrentDate(props, emit);

        const { selectedDates, updateSelectedDates } = useSelectedDates(
            props,
            emit,
            pickerRef,
        );

        const { t } = useLocale();

        const activeIndex = computed(() => {
            if (pickerRef.value.isRange) {
                return props.rangePosition === RANGE_POSITION.LEFT ? 0 : 1;
            }
            return 0;
        });

        const { inputDate, handleDateInput, handleDateInputBlur } =
            useDateInput({
                props,
                selectedDates,
                updateSelectedDates,
                updateCurrentDate,
                picker: pickerRef,
            });

        const { years, yearStart, yearEnd, selectYear, isYearSelect, yearCls } =
            useYear({
                props,
                selectedDates,
                updateSelectedDates,
                activeIndex,
                currentDate,
                updateCurrentDate,
            });

        const {
            isMonthSelect,
            selectMonth,
            monthToNext,
            monthToPre,
            monthCls,
        } = useMonth({
            props,
            selectedDates,
            updateSelectedDates,
            activeIndex,
            currentDate,
            updateCurrentDate,
            picker: pickerRef,
        });

        const { days, isDaySelect, weekNames, dayCls } = useDay({
            props,
            selectedDates,
            currentDate,
            picker: pickerRef,
        });

        const { isQuarterSelect, quarterList, selectQuarter, quarterCls } =
            useQuarter(
                props,
                selectedDates,
                updateSelectedDates,
                activeIndex,
                currentDate,
            );

        const { currentTime, changeTime, innerDisabledTime } = useTime({
            props,
            selectedDates,
            updateSelectedDates,
            activeIndex,
            picker: pickerRef,
        });

        const selectedDay = (info: DayItem) => {
            if (info.next) {
                monthToNext();
            }
            if (info.pre) {
                monthToPre();
            }
            let time;
            if (selectedDates.value[activeIndex.value]?.hour == null) {
                time = getDefaultTime(
                    props.defaultTime,
                    props.rangePosition,
                    pickerRef.value.hasTime,
                );
            }

            updateSelectedDates(
                {
                    year: info.year,
                    month: info.month,
                    day: info.day,
                    ...time,
                },
                activeIndex.value,
            );
        };

        const yearToPre = () => {
            if (isYearSelect.value) {
                updateCurrentDate({
                    year: currentDate.year - YEAR_COUNT,
                });
            } else {
                updateCurrentDate({
                    year: currentDate.year - 1,
                });
            }
        };
        const yearToNext = () => {
            if (isYearSelect.value) {
                updateCurrentDate({
                    year: currentDate.year + YEAR_COUNT,
                });
            } else {
                updateCurrentDate({
                    year: currentDate.year + 1,
                });
            }
        };

        const isNotDisabled = (e: MouseEvent) =>
            (e.target as HTMLElement).className.indexOf(
                `${prefixCls}-date-disabled`,
            ) === -1;

        const visibleLeftSingleArrow = computed(
            () =>
                !isYearSelect.value &&
                !isMonthSelect.value &&
                !isQuarterSelect.value,
        );
        const visibleRightSingleArrow = computed(
            () =>
                !isYearSelect.value &&
                !isMonthSelect.value &&
                !isQuarterSelect.value,
        );

        return {
            prefixCls,
            pickerRef,
            currentDate,
            MONTHS_NAMES,

            inputDate,
            handleDateInput,
            handleDateInputBlur,

            years,
            yearStart,
            yearEnd,
            selectYear,
            isYearSelect,
            yearCls,

            isMonthSelect,
            selectMonth,
            monthCls,

            weekNames,
            isDaySelect,
            days,

            isQuarterSelect,
            quarterList,
            selectQuarter,
            quarterCls,

            dayCls,
            monthToNext,
            monthToPre,
            isNotDisabled,
            selectedDay,

            currentTime,
            changeTime,
            innerDisabledTime,

            yearToPre,
            yearToNext,

            t,

            visibleLeftSingleArrow,
            visibleRightSingleArrow,
        };
    },
});
</script>
