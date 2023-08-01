import { watch, ref, Ref } from 'vue';

import { getTimestampFromFormat, isBeyondRangeTime } from './helper';
import { SELECTED_STATUS, RANGE_POSITION } from './const';
import type { Picker } from './pickerHandler';

import type { CalendarsProps } from './calendars.vue';

type RANGE_POSITION_VALUES =
    (typeof RANGE_POSITION)[keyof typeof RANGE_POSITION];

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
    // TODO 日期组件通过组件区分，不通过 type 区分
    if (!picker.value.isRange) return {};
    const leftActiveDate = ref(
        getTimestampFromFormat(
            tempCurrentValue.value[0] && new Date(tempCurrentValue.value[0]),
            picker.value.format,
        ),
    );
    const rightActiveDate = ref(
        picker.value.getRightActiveDate(leftActiveDate.value),
    );

    const resetActiveDate = () => {
        if (
            picker.value.isInSamePanel(
                tempCurrentValue.value[0],
                tempCurrentValue.value[1],
            )
        ) {
            if (lastSelectedPosition.value === RANGE_POSITION.LEFT) {
                leftActiveDate.value = tempCurrentValue.value[0];
                rightActiveDate.value = picker.value.getRightActiveDate(
                    leftActiveDate.value,
                );
            } else {
                rightActiveDate.value = tempCurrentValue.value[1];
                leftActiveDate.value = picker.value.getLeftActiveDate(
                    rightActiveDate.value,
                );
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
                rightActiveDate.value =
                    picker.value.getRightActiveDate(timestamp);
            }
        } else if (position === RANGE_POSITION.RIGHT) {
            rightActiveDate.value = timestamp;
            if (timestamp <= leftActiveDate.value) {
                leftActiveDate.value =
                    picker.value.getLeftActiveDate(timestamp);
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
