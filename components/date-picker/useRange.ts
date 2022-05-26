import { watch, ref, Ref } from 'vue';

import { contrastDate, parseDate, getTimestampFromFormat } from './helper';
import { SELECTED_STATUS, RANGE_POSITION } from './const';
import type { Picker } from './pickerHandler';

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
    lastSelectedPosition: Ref<RANGE_POSITION>;
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

    const changeCurrentDate = (timestamp: number, position: RANGE_POSITION) => {
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
                // FEATURE: 后续采取 unicode token 标准(https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)，用 d
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
                // FEATURE: 后续采取 unicode token 标准，用 y
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
        if (maxRangeDisabled(date, format)) {
            return true;
        }
        return innerDisabledDate(date, format);
    };

    return {
        leftActiveDate,
        rightActiveDate,
        changeCurrentDate,

        rangeDiabledDate,
        resetActiveDate,
    };
};
