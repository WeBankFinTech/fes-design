import { computed, watch, ref, Ref } from 'vue';

import { contrastDate } from './helper';
import { DATE_TYPE, SELECTED_STATUS, RANGE_POSITION } from './const';

import type { CalendarsProps } from './calendars.vue';

export const useSelectStatus = (props: CalendarsProps) => {
    const selectedStatus = ref<SELECTED_STATUS>(0);

    watch(
        () => props.modelValue,
        () => {
            if (Array.isArray(props.modelValue)) {
                selectedStatus.value = props.modelValue.length
                    ? SELECTED_STATUS.TWO
                    : SELECTED_STATUS.EMPTY;
            }
        },
        {
            immediate: true,
        },
    );

    const selectedDay = () => {
        switch (selectedStatus.value) {
            case SELECTED_STATUS.EMPTY:
                selectedStatus.value = SELECTED_STATUS.ONE;
                break;
            case SELECTED_STATUS.ONE:
                selectedStatus.value = SELECTED_STATUS.TWO;
                break;
            case SELECTED_STATUS.TWO:
                selectedStatus.value = SELECTED_STATUS.ONE;
                break;
            default:
                selectedStatus.value = SELECTED_STATUS.EMPTY;
                break;
        }
    };

    return {
        selectedStatus,
        selectedDay,
    };
};

export const useRange = (
    props: CalendarsProps,
    tempCurrentValue: Ref<number[]>,
    innerDisabledDate: (date: Date, format: string) => boolean | undefined,
) => {
    const isDateRange = computed(() => DATE_TYPE[props.type].isRange);

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

    const changeCurrentDate = (timestamp: number, position: RANGE_POSITION) => {
        if (position === RANGE_POSITION.LEFT) {
            leftDefaultDate.value = timestamp;
            if (timestamp > rightDefaultDate.value) {
                const tempDate = new Date(timestamp);
                rightDefaultDate.value = tempDate.setMonth(
                    tempDate.getMonth() + 1,
                    1,
                );
            }
        } else if (position === RANGE_POSITION.RIGHT) {
            rightDefaultDate.value = timestamp;
            if (timestamp < leftDefaultDate.value) {
                const tempDate = new Date(timestamp);
                leftDefaultDate.value = tempDate.setMonth(
                    tempDate.getMonth() - 1,
                    1,
                );
            }
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
            if (maxRangeDisabled(date, format)) {
                return true;
            }
        }
        return innerDisabledDate(date, format);
    };

    return {
        isDateRange,

        leftDefaultDate,
        rightDefaultDate,
        changeCurrentDate,

        rangeDiabledDate,
    };
};
