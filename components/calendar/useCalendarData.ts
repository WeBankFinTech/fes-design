import { computed, ref } from 'vue';
import { Day } from 'date-fns';
import { isNil } from 'lodash-es';
import { useNormalModel } from '../_util/use/useModel';
import { CalendarInnerProps, CalenderEvent, CalenderShortcut } from './props';
import {
    UseNormalModelReturn,
    convertCalendarDateToUnixTime,
    convertUnixTimeToCalendarDate,
    generateCalendarDates,
    generateCalendarMonths,
    getToday,
    isSameMonth,
} from './utils';
import { CalendarDate, UnixTime } from './types';
import { CALENDAR_ROW_NUM } from './const';

const useCalendarData = (
    props: CalendarInnerProps,
    emit: (
        event: (typeof CalenderEvent)[keyof typeof CalenderEvent],
        ...args: any[]
    ) => void,
) => {
    const [propDate, setPropDate]: UseNormalModelReturn<typeof props, 'date'> =
        useNormalModel(props, emit, {
            prop: 'date',
        });
    const date = computed({
        get: () => convertUnixTimeToCalendarDate(propDate.value),
        set: (nextDate) =>
            setPropDate(
                convertCalendarDateToUnixTime(nextDate, propDate.value),
            ),
    });

    const [propActiveDate, setPropActiveDate]: UseNormalModelReturn<
        typeof props,
        'activeDate'
    > = useNormalModel(props, emit, {
        prop: 'activeDate',
    });
    const activeDate = computed({
        get: () => convertUnixTimeToCalendarDate(propActiveDate.value),
        set: (nextActiveDate) =>
            setPropActiveDate(
                convertCalendarDateToUnixTime(
                    nextActiveDate,
                    propActiveDate.value,
                ),
            ),
    });

    const [mode]: UseNormalModelReturn<typeof props, 'mode'> = useNormalModel(
        props,
        emit,
        {
            prop: 'mode',
        },
    );

    // TODO: 后续支持传参修改
    // 默认从周一开始
    const startDay = ref<Day>(1);

    // 获取今天的日期
    const today = getToday();

    // 日历当前展示的 date
    const displayCalendar = computed<CalendarDate[]>(() => {
        if (mode.value === 'month') {
            return generateCalendarMonths(date.value);
        } else {
            return generateCalendarDates(date.value, {
                startDay: startDay.value,
                weekNum: CALENDAR_ROW_NUM,
            });
        }
    });

    // 快捷选项点击时
    const handleShortcutClick = (time: CalenderShortcut['time']): void => {
        let targetTime: UnixTime;

        if (typeof time === 'function') {
            const result = time();
            if (isNil(result)) return;
            targetTime = result;
        } else {
            targetTime = time;
        }

        // 直接操作 props 中的数据，因为只有 props 中的是 UnixTime
        setPropDate(targetTime);
        setPropActiveDate(targetTime);
    };

    // 日历格子点击时
    const handleCellClick = (cellDate: CalendarDate): void => {
        emit(CalenderEvent.CELL_CLICK, {
            date: convertCalendarDateToUnixTime(cellDate, propDate.value),
            mode: mode.value,
        });

        if (!isSameMonth(cellDate, date.value)) {
            date.value = cellDate;
        }
        activeDate.value = cellDate;
    };

    return {
        date,
        mode,
        activeDate,
        today,
        startDay,
        displayCalendar,
        handleShortcutClick,
        handleCellClick,
    };
};

export default useCalendarData;
