import { watch, ref, Ref } from 'vue';

import { parseDate, getTimestampFromFormat, isBeyondRangeTime } from './helper';
import { SELECTED_STATUS, RANGE_POSITION } from './const';
import type { Picker } from './pickerHandler';

import type { CalendarsProps } from './calendars.vue';

type RANGE_POSITION_VALUES = typeof RANGE_POSITION[keyof typeof RANGE_POSITION];

export const useSelectStatus = (props: CalendarsProps) => {
    const selectedStatus = ref<SELECTED_STATUS>(0);
    const lastSelectedPosition = ref<RANGE_POSITION_VALUES>();

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

    watch(
        () => props.visible,
        () => {
            if (
                !props.visible &&
                selectedStatus.value === SELECTED_STATUS.ONE
            ) {
                selectedStatus.value = SELECTED_STATUS.EMPTY;
            }
        },
    );

    const selectedDay = (position: RANGE_POSITION_VALUES) => {
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

export const useRange = ({
    props,
    tempCurrentValue,
    innerDisabledDate,
    selectedStatus,
    lastSelectedPosition,
    picker,
}: {
    props: CalendarsProps;
    tempCurrentValue: Ref<number[]>;
    innerDisabledDate: (date: Date, format: string) => boolean | undefined;
    selectedStatus: Ref<SELECTED_STATUS>;
    lastSelectedPosition: Ref<RANGE_POSITION_VALUES>;
    picker: Ref<Picker>;
}) => {
    const leftActiveDate = ref(
        getTimestampFromFormat(
            tempCurrentValue.value[0] && new Date(tempCurrentValue.value[0]),
            picker.value.format,
        ),
    );
    const endDate = new Date(leftActiveDate.value);
    const rightActiveDate = ref(endDate.setMonth(endDate.getMonth() + 1, 1));

    const resetActiveDate = () => {
        const leftDate = parseDate(tempCurrentValue.value[0]);
        const rightDate = parseDate(tempCurrentValue.value[1]);
        if (
            leftDate.year === rightDate.year &&
            leftDate.month === rightDate.month
        ) {
            if (lastSelectedPosition.value === RANGE_POSITION.LEFT) {
                const date = new Date(tempCurrentValue.value[0]);
                leftActiveDate.value = tempCurrentValue.value[0];
                rightActiveDate.value = date.setMonth(date.getMonth() + 1, 1);
            } else {
                const date = new Date(tempCurrentValue.value[1]);
                rightActiveDate.value = tempCurrentValue.value[1];
                leftActiveDate.value = date.setMonth(date.getMonth() - 1, 1);
            }
        } else {
            leftActiveDate.value = tempCurrentValue.value[0];
            rightActiveDate.value = tempCurrentValue.value[1];
        }
    };

    const changeCurrentDate = (
        timestamp: number,
        position: RANGE_POSITION_VALUES,
    ) => {
        if (position === RANGE_POSITION.LEFT) {
            leftActiveDate.value = timestamp;
            if (timestamp >= rightActiveDate.value) {
                const tempDate = new Date(timestamp);
                rightActiveDate.value = tempDate.setMonth(
                    tempDate.getMonth() + 1,
                    1,
                );
            }
        } else if (position === RANGE_POSITION.RIGHT) {
            rightActiveDate.value = timestamp;
            if (timestamp <= leftActiveDate.value) {
                const tempDate = new Date(timestamp);
                leftActiveDate.value = tempDate.setMonth(
                    tempDate.getMonth() - 1,
                    1,
                );
            }
        }
    };

    const maxRangeDisabled = (date: Date, format: string, flagDate?: Date) => {
        if (flagDate) {
            return isBeyondRangeTime({
                flagDate,
                currentDate: date,
                maxRange: props.maxRange,
                format,
            });
        } else if (
            props.maxRange &&
            selectedStatus.value === SELECTED_STATUS.ONE
        ) {
            return isBeyondRangeTime({
                flagDate: new Date(tempCurrentValue.value[0]),
                currentDate: date,
                maxRange: props.maxRange,
                format,
            });
        }
        return false;
    };

    const rangeDisabledDate = (date: Date, format: string, flagDate?: Date) => {
        if (maxRangeDisabled(date, format, flagDate)) {
            return true;
        }
        return innerDisabledDate(date, format);
    };

    return {
        leftActiveDate,
        rightActiveDate,
        changeCurrentDate,

        rangeDisabledDate,
        resetActiveDate,
    };
};
