<template>
    <div :class="prefixCls">
        <div>
            <div :class="`${prefixCls}-head`">
                <div :class="`${prefixCls}-head-left`">
                    <DoubleLeftOutlined
                        v-show="visibleLeftArrow"
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
                        {{ currentDate.year }}年
                    </span>
                    <span
                        v-show="
                            !isYearSelect && !isMonthSelect && !isQuarterSelect
                        "
                        :class="`${prefixCls}-head-middle-item`"
                    >
                        {{ currentDate.month + 1 + '月' }}
                    </span>
                </div>
                <div :class="`${prefixCls}-head-right`">
                    <RightOutlined
                        v-show="visibleRightSingleArrow"
                        :class="`${prefixCls}-icon`"
                        @click="monthToNext"
                    />
                    <DoubleRightOutlined
                        v-show="visibleRightArrow"
                        :class="`${prefixCls}-icon`"
                        @click="yearToNext"
                    />
                </div>
            </div>
            <div :class="`${prefixCls}-body`">
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
                        @click="isNotDisabled($event) && selecteDay(item)"
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
                        {{ monthName }}
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
                        {{ item.name }}
                    </span>
                </div>
            </div>
        </div>
        <div v-if="hasTime" :class="`${prefixCls}-time`">
            <div :class="`${prefixCls}-time-head`">{{ currentTime }}</div>
            <TimeSelect
                :class="`${prefixCls}-time-body`"
                :visible="visible"
                :modelValue="currentTime"
                :visibleCount="10"
                v-bind="innerDisabledTime"
                @change="changeTime"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ExtractPropTypes } from 'vue';
import {
    LeftOutlined,
    RightOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from '../icon';
import TimeSelect from '../time-picker/time-select.vue';
import getPrefixCls from '../_util/getPrefixCls';

import { isCompeleteSelected } from './helper';
import { RANGE_POSITION, COMMON_PROPS, DATE_TYPE, YEAR_COUNT } from './const';

import {
    useCurrentDate,
    useSelectedDates,
    useYear,
    useMonth,
    useDay,
    useQuarter,
    useTime,
} from './useCalendar';

import type { DayItem } from './interface';

const prefixCls = getPrefixCls('calendar');

const MONTHS_NAMES = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
];

const calendarProps = {
    ...COMMON_PROPS,
    rangePosition: {
        type: String as PropType<RANGE_POSITION>,
    },
    modelValue: Array as PropType<number[]>,
    defaultDate: Number,
    visible: {
        type: Boolean,
        default: false,
    },
    visibleLeftArrow: {
        type: Boolean,
        default: true,
    },
    visibleRightArrow: {
        type: Boolean,
        default: true,
    },
    disabledDate: {
        type: Function as PropType<
            (date: Date, format: string) => boolean | undefined
        >,
    },
} as const;

export type CalendarProps = Partial<ExtractPropTypes<typeof calendarProps>>;

export default defineComponent({
    name: 'FCalendar',
    components: {
        LeftOutlined,
        RightOutlined,
        DoubleLeftOutlined,
        DoubleRightOutlined,
        TimeSelect,
    },
    props: calendarProps,
    emits: ['change', 'changeCurrentDate'],
    setup(props, { emit }) {
        const { currentDate, updateCurrentDate } = useCurrentDate(props, emit);

        const { selectedDates, updateSelectedDates } = useSelectedDates(
            props,
            emit,
        );

        const activeIndex = computed(() => {
            if (DATE_TYPE[props.type].isRange) {
                if (props.type === DATE_TYPE.daterange.name) {
                    const leftComplete = isCompeleteSelected(
                        selectedDates.value[0],
                        props.type,
                    );
                    const rightComplete = isCompeleteSelected(
                        selectedDates.value[1],
                        props.type,
                    );
                    if (!leftComplete || (leftComplete && rightComplete)) {
                        return 0;
                    }
                    return 1;
                }

                if (props.type === DATE_TYPE.datetimerange.name) {
                    return props.rangePosition === RANGE_POSITION.LEFT ? 0 : 1;
                }
            }
            return 0;
        });

        const { years, yearStart, yearEnd, selectYear, isYearSelect, yearCls } =
            useYear(
                props,
                selectedDates,
                updateSelectedDates,
                activeIndex,
                currentDate,
                updateCurrentDate,
            );

        const {
            isMonthSelect,
            selectMonth,
            monthToNext,
            monthToPre,
            monthCls,
        } = useMonth(
            props,
            selectedDates,
            updateSelectedDates,
            activeIndex,
            currentDate,
            updateCurrentDate,
        );

        const { days, isDaySelect, weekNames, dayCls } = useDay(
            props,
            selectedDates,
            updateSelectedDates,
            activeIndex,
            currentDate,
        );

        const { isQuarterSelect, quarterList, selectQuarter, quarterCls } =
            useQuarter(
                props,
                selectedDates,
                updateSelectedDates,
                activeIndex,
                currentDate,
            );

        const { hasTime, currentTime, changeTime, innerDisabledTime } = useTime(
            props,
            selectedDates,
            updateSelectedDates,
            activeIndex,
        );

        const selecteDay = (info: DayItem) => {
            info.next && monthToNext();
            info.pre && monthToPre();

            const time: any = {};
            if (
                DATE_TYPE[props.type].hasTime &&
                !selectedDates.value[activeIndex.value]?.hour
            ) {
                const date = new Date();
                time.hour = date.getHours();
                time.minute = date.getMinutes();
                time.second = date.getSeconds();
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

        const visibleLeftSingleArrow = computed(
            () =>
                !isYearSelect.value &&
                !isMonthSelect.value &&
                !isQuarterSelect.value &&
                props.visibleLeftArrow,
        );

        const visibleRightSingleArrow = computed(
            () =>
                !isYearSelect.value &&
                !isMonthSelect.value &&
                !isQuarterSelect.value &&
                props.visibleRightArrow,
        );

        const isNotDisabled = (e: MouseEvent) =>
            (e.target as HTMLElement).className.indexOf(
                `${prefixCls}-date-disabled`,
            ) === -1;
        return {
            prefixCls,
            currentDate,
            MONTHS_NAMES,

            visibleLeftSingleArrow,
            visibleRightSingleArrow,

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
            selecteDay,

            hasTime,
            currentTime,
            changeTime,
            innerDisabledTime,

            yearToPre,
            yearToNext,
        };
    },
});
</script>
