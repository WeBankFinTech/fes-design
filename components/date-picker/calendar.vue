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
                        v-show="
                            !isYearSelect &&
                            !isMonthSelect &&
                            !isQuarterSelect &&
                            visibleLeftArrow
                        "
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
                        v-show="
                            !isYearSelect &&
                            !isMonthSelect &&
                            !isQuarterSelect &&
                            visibleRightArrow
                        "
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

<script setup lang="ts">
import { ref, computed, reactive, watchEffect, watch } from 'vue';
import {
    LeftOutlined,
    RightOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from '../icon';
import TimeSelect from '../time-picker/time-select.vue';
import getPrefixCls from '../_util/getPrefixCls';

import { RANGE_POSITION, DATE_TYPE, YEAR_COUNT } from './const';

import { CommonProps } from './interface';

const prefixCls = getPrefixCls('calendar');

// TODO 国际化
const WEEK_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

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

type CalendarProps = CommonProps & {
    rangePosition: RANGE_POSITION;
    defaultDate: number;
    visible: boolean;
    visibleLeftArrow: boolean;
    visibleRightArrow: boolean;
};

type CalendarEmits = {
    (e: 'change', val: number): void;
    (e: 'changeCurrentDate', val: number): void;
};

const props = withDefaults(defineProps<CalendarProps>(), {
    type: DATE_TYPE.date.name,
    visible: false,
    visibleLeftArrow: true,
    visibleRightArrow: true,
    disabledDate: () => false,
    disabledTime: () => false,
});

const emit = defineEmits<CalendarEmits>();

const { currentDate, updateCurrentDate } = useCurrentDate(props, emit);

const { selectedDates, updateSelectedDates } = useSelectedDates(props, emit);

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
            return props.rangePosition === LEFT_RANGE ? 0 : 1;
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

const { isMonthSelect, selectMonth, monthToNext, monthToPre, monthCls } =
    useMonth(
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

const { isQuarterSelect, quarterList, selectQuarter, quarterCls } = useQuarter(
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

const selecteDay = (info) => {
    info.next && monthToNext();
    info.pre && monthToPre();

    const time = {};
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

const isNotDisabled = (e: MouseEvent) =>
    (e.target as HTMLElement).className.indexOf(
        `${prefixCls}-date-disabled`,
    ) === -1;
</script>

<script>
export default {
    name: 'FCalendar',
};
</script>
