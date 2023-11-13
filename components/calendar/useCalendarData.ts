import { computed, ref } from 'vue';
import { Day } from 'date-fns';
import { isNil } from 'lodash-es';
import { useNormalModel } from '../_util/use/useModel';
import { CalendarEvent, CalendarInnerProps, CalendarShortcut } from './props';
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
        event: (typeof CalendarEvent)[keyof typeof CalendarEvent],
        ...args: any[]
    ) => void,
) => {
    const [propActiveDate, setPropActiveDate]: UseNormalModelReturn<
        typeof props,
        'modelValue'
    > = useNormalModel(props, emit, {
        prop: 'modelValue',
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

    // 以此为锚定计算需要展示的日历
    const displayAnchorDate = ref<CalendarDate>(today);

    // 日历当前展示的 date
    const displayCalendar = computed<CalendarDate[]>(() => {
        if (mode.value === 'month') {
            return generateCalendarMonths(displayAnchorDate.value);
        } else {
            return generateCalendarDates(displayAnchorDate.value, {
                startDay: startDay.value,
                weekNum: CALENDAR_ROW_NUM,
            });
        }
    });

    // 快捷选项点击时
    const handleShortcutClick = (time: CalendarShortcut['time']): void => {
        let targetTime: UnixTime;

        if (typeof time === 'function') {
            const result = time();
            if (isNil(result)) return;
            targetTime = result;
        } else {
            targetTime = time;
        }

        // 当前显示的日历跳转到指定的日期
        displayAnchorDate.value = convertUnixTimeToCalendarDate(targetTime);
        // 直接操作 props 中的数据，因为只有 props 中的是 UnixTime
        setPropActiveDate(targetTime);
    };

    // 日历格子点击时
    const handleCellClick = (cellDate: CalendarDate): void => {
        emit(CalendarEvent.CELL_CLICK, {
            date: convertCalendarDateToUnixTime(cellDate, propActiveDate.value),
            mode: mode.value,
        });

        if (
            mode.value === 'date' &&
            !isSameMonth(cellDate, displayAnchorDate.value)
        ) {
            displayAnchorDate.value = cellDate;
        }
        activeDate.value = cellDate;
    };

    return {
        activeDate,
        mode,
        displayAnchorDate,
        displayCalendar,
        today,
        startDay,
        handleShortcutClick,
        handleCellClick,
    };
};

export default useCalendarData;
