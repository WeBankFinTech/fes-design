import { computed, watch, ref, Ref } from 'vue';

import { contrastDate, parseDate } from './helper';
import { DATE_TYPE, SELECTED_STATUS, RANGE_POSITION } from './const';

import type { CalendarsProps } from './calendars.vue';

export const useSelectStatus = (props: CalendarsProps) => {
    const selectedStatus = ref<SELECTED_STATUS>(0);
    const lastSelectedPosition = ref<RANGE_POSITION>();

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

    const selectedDay = (position: RANGE_POSITION) => {
        lastSelectedPosition.value = position;
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
        lastSelectedPosition,
    };
};

export const useRange = (
    props: CalendarsProps,
    tempCurrentValue: Ref<number[]>,
    innerDisabledDate: (date: Date, format: string) => boolean | undefined,
    selectedStatus: Ref<SELECTED_STATUS>,
    lastSelectedPosition: Ref<RANGE_POSITION>,
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
            if (props.visible && tempCurrentValue.value.length) {
                const leftDate = parseDate(tempCurrentValue.value[0]);
                const rightDate = parseDate(tempCurrentValue.value[1]);
                if (
                    leftDate.year === rightDate.year &&
                    leftDate.month === rightDate.month
                ) {
                    if (lastSelectedPosition.value === RANGE_POSITION.LEFT) {
                        const date = new Date(tempCurrentValue.value[0]);
                        leftDefaultDate.value = tempCurrentValue.value[0];
                        rightDefaultDate.value = date.setMonth(
                            date.getMonth() + 1,
                            1,
                        );
                    } else {
                        const date = new Date(tempCurrentValue.value[1]);
                        rightDefaultDate.value = tempCurrentValue.value[1];
                        leftDefaultDate.value = date.setMonth(
                            date.getMonth() - 1,
                            1,
                        );
                    }
                } else {
                    leftDefaultDate.value = tempCurrentValue.value[0];
                    rightDefaultDate.value = tempCurrentValue.value[1];
                }
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
        if (props.maxRange && selectedStatus.value === SELECTED_STATUS.ONE) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const arr = props.maxRange.match(/(\d*)([MDY])/)!;
            const length = Number(arr[1]) - 1;
            const type = arr[2];

            const dateFlag = new Date(tempCurrentValue.value[0]);
            let minDate: Date;
            let maxDate: Date;

            if (type === 'D') {
                minDate = new Date(dateFlag);
                maxDate = new Date(dateFlag);
                minDate.setDate(minDate.getDate() - length);
                maxDate.setDate(maxDate.getDate() + length);
            } else if (type === 'M') {
                minDate = new Date(dateFlag);
                maxDate = new Date(dateFlag);
                minDate.setMonth(minDate.getMonth() - length, 1);
                maxDate.setMonth(maxDate.getMonth() + length, 1);
            } else if (type === 'Y') {
                minDate = new Date(dateFlag.getFullYear() + length, 0);
                maxDate = new Date(dateFlag.getFullYear() - length, 0);
            }
            if (!(minDate || maxDate)) {
                return false;
            }
            return beyondTimeScope(minDate, maxDate, date, format);
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
