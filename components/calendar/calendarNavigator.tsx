import {
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
} from 'vue';
import { addMonths, addYears, subMonths, subYears } from 'date-fns';
import getPrefixCls from '../_util/getPrefixCls';
import { useLocale } from '../config-provider/useLocale';
import {
    LeftOutlined,
    RightOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from '../icon';
import { COMPONENT_NAME } from './const';
import {
    convertCalendarDateToDate,
    convertDateToCalendarDate,
    getToday,
} from './utils';
import { type CalendarDate } from './types';

/** 切换日期的最小单位，按月、按年 */
export type CalendarNavUnit = 'month' | 'year';

const prefixCls = getPrefixCls('calendar-navigator');
const cls = (className: string) => `${prefixCls}-${className}`;

const props = {
    date: {
        type: Object as PropType<CalendarDate>,
        default: () => getToday(),
        required: true,
    },
    navUnit: {
        type: String as PropType<CalendarNavUnit>,
        default: 'month' satisfies CalendarNavUnit,
    },
} as const satisfies ComponentObjectPropsOptions;

export default defineComponent({
    name: `${COMPONENT_NAME}Navigator`,
    props: props,
    emits: ['update:date'],
    setup: (props, { emit }) => {
        const { t } = useLocale();

        const date = computed({
            get: () => props.date,
            set: (nextDate) => emit('update:date', nextDate),
        });

        const displayDate = computed<string>(() => {
            if (props.navUnit === 'year') {
                return [date.value.year, ' ', t('datePicker.year')].join('');
            }
            return [
                date.value.year,
                ' ',
                t('datePicker.year'),
                ' ',
                t(`datePicker.month${date.value.month + 1}`),
            ].join('');
        });

        const handleDateChange = (
            unit: CalendarNavUnit,
            direction: 'add' | 'subtract',
        ) => {
            let manipulate;
            if (unit === 'month') {
                manipulate = direction === 'add' ? addMonths : subMonths;
            } else {
                manipulate = direction === 'add' ? addYears : subYears;
            }
            const nextDate = manipulate(
                convertCalendarDateToDate(date.value),
                1,
            );
            date.value = convertDateToCalendarDate(nextDate);
        };

        return () => (
            <div class={prefixCls}>
                <DoubleLeftOutlined
                    class={cls('btn')}
                    onClick={() => handleDateChange('year', 'subtract')}
                />
                {props.navUnit === 'month' && (
                    <LeftOutlined
                        class={cls('btn')}
                        onClick={() => handleDateChange('month', 'subtract')}
                    />
                )}
                <div class={cls('current-date')}>{displayDate.value}</div>
                {props.navUnit === 'month' && (
                    <RightOutlined
                        class={cls('btn')}
                        onClick={() => handleDateChange('month', 'add')}
                    />
                )}
                <DoubleRightOutlined
                    class={cls('btn')}
                    onClick={() => handleDateChange('year', 'add')}
                />
            </div>
        );
    },
});
