import { Ref, computed } from 'vue';
import { Day } from 'date-fns';
import { useLocale } from '../config-provider/useLocale';
import { CalenderMode } from './props';

const WEEK_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const useWeekNames = (startDay: Ref<Day>, mode: Ref<CalenderMode>) => {
    const { t } = useLocale();

    const weekNames = computed(() => {
        if (mode.value === 'month') {
            return [];
        }
        return [...WEEK_NAMES, ...WEEK_NAMES]
            .slice(startDay.value, startDay.value + 7)
            .map((day) => t(`datePicker.weeks.${day}`));
    });

    return { weekNames };
};

export default useWeekNames;
