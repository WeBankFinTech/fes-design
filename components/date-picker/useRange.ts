import { computed, watch, ref, Ref } from 'vue';

import { contrastDate } from './helper';
import { DATE_TYPE, RANGE_POSITION } from './const';

import type { CalendarsProps } from './calendars.vue';

export const useRange = (
    props: CalendarsProps,
    tempCurrentValue: Ref<number[]>,
    innerDisabledDate: (date: Date, format: string) => boolean | undefined,
) => {
    const isDateTimeRange = computed(
        () => props.type === DATE_TYPE.datetimerange.name,
    );
    const isDateRange = computed(() => props.type === DATE_TYPE.daterange.name);

    const activeRangePosition = ref(RANGE_POSITION.LEFT);
    const startDate = tempCurrentValue.value[0]
        ? new Date(tempCurrentValue.value[0])
        : new Date();
    const leftDefaultDate = ref(startDate.getTime());
    const rightDefaultDate = ref(
        startDate.setMonth(startDate.getMonth() + 1, 1),
    );

    watch(
        () => props.visible,
        () => {
            if (props.visible) {
                leftDefaultDate.value =
                    tempCurrentValue.value[0] || leftDefaultDate.value;
            }
        },
    );

    const changeCurrentDate = (timestamp: number) => {
        const tempDate = new Date(timestamp);
        if (activeRangePosition.value === RANGE_POSITION.LEFT) {
            rightDefaultDate.value = tempDate.setMonth(
                tempDate.getMonth() + 1,
                1,
            );
        } else {
            leftDefaultDate.value = tempDate.setMonth(
                tempDate.getMonth() - 1,
                1,
            );
        }
    };

    const updateRangePosition = (val: RANGE_POSITION) => {
        activeRangePosition.value = val;
        if (isDateTimeRange.value && val === RANGE_POSITION.RIGHT) {
            rightDefaultDate.value = leftDefaultDate.value;
        }
    };

    // disable 相关逻辑
    const beyondTimeScope = (
        min: Date,
        max: Date,
        time: Date,
        format: string,
    ) =>
        contrastDate(time, min, format) === -1 ||
        contrastDate(time, max, format) === 1;
    const maxRangeDisabled = (date: Date, format: string) => {
        if (props.maxRange && tempCurrentValue.value) {
            const [start, end] = tempCurrentValue.value;
            if ((start && end) || !(start || end)) return false;

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const arr = props.maxRange.match(/(\d*)([MDY])/)!;
            const length = Number(arr[1]) - 1;
            const type = arr[2];

            let minDate: Date | null = null;
            let maxDate: Date | null = null;

            if (start) {
                minDate = new Date(start);
            }
            if (end) {
                maxDate = new Date(end);
            }

            if (type === 'D') {
                if (minDate) {
                    maxDate = new Date(minDate);
                    maxDate.setDate(maxDate.getDate() + length);
                } else if (maxDate) {
                    minDate = new Date(maxDate);
                    minDate.setDate(minDate.getDate() - length);
                }
            } else if (type === 'M') {
                if (minDate) {
                    maxDate = new Date(minDate);
                    maxDate.setMonth(maxDate.getMonth() + length, 1);
                } else if (maxDate) {
                    minDate = new Date(maxDate);
                    minDate.setMonth(maxDate.getMonth() - length, 1);
                }
            } else if (type === 'Y') {
                if (minDate) {
                    maxDate = new Date(minDate.getFullYear() - length, 0);
                } else if (maxDate) {
                    minDate = new Date(maxDate.getFullYear() + length, 0);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return beyondTimeScope(minDate!, maxDate!, date, format);
        }
        return false;
    };

    const rangeDiabledDate = (date: Date, format: string) => {
        if (DATE_TYPE[props.type].isRange) {
            if (
                activeRangePosition.value === RANGE_POSITION.RIGHT &&
                tempCurrentValue.value[0] &&
                contrastDate(
                    date,
                    new Date(tempCurrentValue.value[0]),
                    format,
                ) === -1
            ) {
                return true;
            }

            if (
                activeRangePosition.value === RANGE_POSITION.LEFT &&
                tempCurrentValue.value[1] &&
                !tempCurrentValue.value[0] &&
                contrastDate(
                    date,
                    new Date(tempCurrentValue.value[1]),
                    format,
                ) === 1
            ) {
                return true;
            }

            if (maxRangeDisabled(date, format)) {
                return true;
            }
        }
        return innerDisabledDate(date, format);
    };

    return {
        isDateRange,
        isDateTimeRange,

        leftDefaultDate,
        rightDefaultDate,
        changeCurrentDate,

        activeRangePosition,
        updateRangePosition,
        rangeDiabledDate,
    };
};
