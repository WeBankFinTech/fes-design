import {
    type CSSProperties,
    type SlotsType,
    type VNode,
    type VNodeChild,
    computed,
    defineComponent,
} from 'vue';
import { isNumber } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import { useLocale } from '../config-provider/useLocale';
import FSpace from '../space';
import FButton from '../button';
import { isValidRenderResult } from '../timeline/utils';
import { COMPONENT_NAME, prefixCls } from './const';
import {
    cls,
    convertCalendarDateToUnixTime,
    isSameDate,
    isSameMonth,
} from './utils';
import {
    CalendarEvent,
    calendarProps,
    type CalendarSlots as Slots,
} from './props';
import { type CalendarDate } from './types';
import useWeekNames from './useWeekNames';
import CalendarNavigator from './calendarNavigator';
import useCalendarData from './useCalendarData';

export default defineComponent({
    name: COMPONENT_NAME,
    props: calendarProps,
    emits: [
        CalendarEvent.UPDATE_MODEL,
        CalendarEvent.UPDATE_MODE,
        CalendarEvent.CELL_CLICK,
    ],
    slots: Object as SlotsType<Slots>,
    setup: (props, { emit, slots }) => {
        useTheme();
        const { t } = useLocale();

        const {
            activeDate,
            mode,
            displayAnchorDate,
            displayCalendar,
            today,
            startDay,
            handleShortcutClick,
            handleCellClick,
        } = useCalendarData(props, emit);

        const { weekNames } = useWeekNames(startDay, mode);

        const renderCalendarCellContent = (
            cellDate: CalendarDate,
        ): VNodeChild => {
            // 插槽渲染
            if (slots.cellMain) {
                const customContent = slots.cellMain({
                    mode: mode.value,
                    date: convertCalendarDateToUnixTime(cellDate),
                });
                if (isValidRenderResult(customContent)) {
                    return customContent;
                }
            }

            let mainContent: string;
            if (mode.value === 'date') {
                mainContent = cellDate.date.toString();
            } else {
                mainContent = t(`datePicker.month${cellDate.month + 1}`);
            }
            return (
                <div class={cls('panel-cell-main-content')}>{mainContent}</div>
            );
        };

        const renderCalendarAppendantContent = (
            cellDate: CalendarDate,
        ): VNodeChild => {
            if (!slots.cellAppendant) {
                return undefined;
            }
            return (
                <div class={cls('panel-cell-appendant-content')}>
                    {slots.cellAppendant({
                        mode: mode.value,
                        date: convertCalendarDateToUnixTime(cellDate),
                    })}
                </div>
            );
        };

        // 组件的 class
        const classList = computed<string[]>(() => [
            prefixCls,
            props.splitLine ? '' : cls('without-split-line'),
        ]);

        // 组件的样式
        const styles = computed<CSSProperties>(() => ({
            height: isNumber(props.height) ? `${props.height}px` : props.height,
        }));

        // 日历格子的样式
        const calculateCellClassList = (cell: CalendarDate): string[] => {
            const classList = [cls('panel-cell')];

            const isSame = mode.value === 'month' ? isSameMonth : isSameDate;

            if (isSame(cell, today)) {
                classList.push(cls('panel-cell-today'));
            }

            if (isSame(cell, activeDate.value)) {
                classList.push(cls('panel-cell-active'));
            }

            if (mode.value === 'date') {
                if (!isSameMonth(cell, displayAnchorDate.value)) {
                    classList.push(cls('panel-cell-secondary'));
                }
            }

            return classList;
        };

        // 操作栏
        const renderActionBar = (): VNode => (
            <div class={cls('action-bar')}>
                <div class={cls('action-bar-left')}>
                    <CalendarNavigator
                        v-model={[displayAnchorDate.value, 'date']}
                        navUnit={mode.value === 'date' ? 'month' : 'year'}
                    />
                </div>
                <FSpace class={cls('action-bar-right')} justify="end">
                    {props.shortcuts.map(({ label, time }) => (
                        <FButton onClick={() => handleShortcutClick(time)}>
                            {label}
                        </FButton>
                    ))}
                </FSpace>
            </div>
        );

        // 星期栏
        const renderWeekNameHeader = (): VNode => {
            if (mode.value === 'month') return undefined;
            return (
                <div class={cls('week-name-header')}>
                    {weekNames.value.map((weekName) => (
                        <div class={cls('week-name-header-cell')}>
                            <div
                                class={cls(
                                    'week-name-header-cell-main-content',
                                )}
                            >
                                {weekName}
                            </div>
                        </div>
                    ))}
                </div>
            );
        };

        return () => (
            <div class={classList.value} style={styles.value}>
                {renderActionBar()}
                <div class={cls('panel')}>
                    {/* 星期栏 */}
                    {renderWeekNameHeader()}
                    {/* 日历的每一格 */}
                    <div class={cls(`${mode.value}-panel`)}>
                        {displayCalendar.value.map((cell) => (
                            <div
                                class={calculateCellClassList(cell)}
                                onClick={() => handleCellClick(cell)}
                            >
                                {renderCalendarCellContent(cell)}
                                {renderCalendarAppendantContent(cell)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    },
});
