<template>
    <div :class="[prefixCls]">
        <div v-if="isDateRange" :class="`${prefixCls}-daterange`">
            <Calendar
                :modelValue="tempCurrentValue"
                :type="type"
                :disabledTime="disabledTime"
                :disabledDate="rangeDiabledDate"
                :visible="visible"
                :visibleRightArrow="false"
                :rangePosition="LEFT_RANGE"
                :defaultDate="leftDefaultDate"
                @change="updateTempCurrentValue"
                @changeCurrentDate="changeCurrentDate"
            />
            <Calendar
                :modelValue="tempCurrentValue"
                :type="type"
                :visible="visible"
                :visibleLeftArrow="false"
                :disabledTime="disabledTime"
                :disabledDate="rangeDiabledDate"
                :rangePosition="RIGHT_RANGE"
                :defaultDate="rightDefaultDate"
                @change="updateTempCurrentValue"
                @changeCurrentDate="changeCurrentDate"
            />
        </div>
        <Calendar
            v-else-if="isDateTimeRange"
            :modelValue="tempCurrentValue"
            :type="type"
            :visible="visible"
            :disabledTime="disabledTime"
            :disabledDate="rangeDiabledDate"
            :rangePosition="activeRangePosition"
            :defaultDate="
                activeRangePosition === LEFT_RANGE
                    ? leftDefaultDate
                    : rightDefaultDate
            "
            @change="updateTempCurrentValue"
        />
        <Calendar
            v-else
            :modelValue="tempCurrentValue"
            :type="type"
            :visible="visible"
            :disabledTime="disabledTime"
            :disabledDate="innerDisabledDate"
            @change="updateTempCurrentValue"
        />
        <div v-if="visibleFooter" :class="`${prefixCls}-footer`">
            <div :class="`${prefixCls}-footer-inner`">
                <WButton type="link" size="small" @click="selectCurrentTime">
                    {{ currentDateType.currentText }}
                </WButton>
                <WButton
                    :disabled="confirmDisabled"
                    type="primary"
                    size="small"
                    @click="confirm"
                >
                    确定
                </WButton>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import Calendar from './calendar';
import { useNormalModel } from '../_util/use/useModel';
import WButton from '../button';
import { contrastDate, getTimestampFromFormat } from './helper';
import {
    COMMON_PROPS,
    CALENDARS_PROPS,
    RANGE_PROPS,
    DATE_TYPE,
    LEFT_RANGE,
    RIGHT_RANGE,
} from './const';

const prefixCls = getPrefixCls('calendars');

const useRange = (props, tempCurrentValue, innerDisabledDate) => {
    const isDateTimeRange = computed(
        () => props.type === DATE_TYPE.datetimerange.name,
    );
    const isDateRange = computed(() => props.type === DATE_TYPE.daterange.name);

    const activeRangePosition = ref(LEFT_RANGE);
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

    const changeCurrentDate = (timestamp) => {
        const tempDate = new Date(timestamp);
        if (activeRangePosition.value === LEFT_RANGE) {
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

    const updateRangePosition = (val) => {
        activeRangePosition.value = val;
        if (isDateTimeRange.value && val === RIGHT_RANGE) {
            rightDefaultDate.value = leftDefaultDate.value;
        }
    };

    // disable 相关逻辑
    const beyondTimeScope = (min, max, time, format) =>
        contrastDate(time, min, format) === -1 ||
        contrastDate(time, max, format) === 1;
    const maxRangeDisabled = (date, format) => {
        if (props.maxRange && tempCurrentValue.value) {
            const [start, end] = tempCurrentValue.value;
            if ((start && end) || !(start || end)) return false;

            const arr = props.maxRange.match(/(\d*)([MDY])/);
            const length = Number(arr[1]) - 1;
            const type = arr[2];

            let minDate;
            let maxDate;

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
                } else {
                    minDate = new Date(maxDate);
                    minDate.setDate(minDate.getDate() - length);
                }
            } else if (type === 'M') {
                if (minDate) {
                    maxDate = new Date(minDate);
                    maxDate.setMonth(maxDate.getMonth() + length, 1);
                } else {
                    minDate = new Date(maxDate);
                    minDate.setMonth(maxDate.getMonth() - length, 1);
                }
            } else if (type === 'Y') {
                if (minDate) {
                    maxDate = new Date(minDate.getFullYear() - length, 0);
                } else {
                    minDate = new Date(maxDate.getFullYear() + length, 0);
                }
            }
            return beyondTimeScope(minDate, maxDate, date, format);
        }
        return false;
    };

    const rangeDiabledDate = (date, format) => {
        if (DATE_TYPE[props.type].isRange) {
            if (
                activeRangePosition.value === RIGHT_RANGE &&
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
                activeRangePosition.value === LEFT_RANGE &&
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

export default {
    name: 'FCalendars',
    components: {
        Calendar,
        WButton,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        ...COMMON_PROPS,
        ...CALENDARS_PROPS,
        ...RANGE_PROPS,
    },
    emits: ['update:modelValue', 'tmpSelectedDateChange', 'change'],
    setup(props, { emit }) {
        const [selectedDates] = useNormalModel(props, emit);
        const currentDateType = computed(() => DATE_TYPE[props.type] || {});

        const tempCurrentValue = ref([]);

        const innerDisabledDate = (date, format) => {
            const min =
                props.minDate &&
                contrastDate(date, props.minDate, format) === -1;
            const max =
                props.maxDate &&
                contrastDate(date, props.maxDate, format) === 1;
            return min || max || props.disabledDate(date);
        };

        const {
            isDateRange,
            isDateTimeRange,

            leftDefaultDate,
            rightDefaultDate,
            changeCurrentDate,

            activeRangePosition,
            updateRangePosition,
            rangeDiabledDate,
        } = useRange(props, tempCurrentValue, innerDisabledDate);

        const confirmDisabled = computed(() => {
            if (props.type === DATE_TYPE.daterange.name) {
                return !(
                    tempCurrentValue.value[0] && tempCurrentValue.value[1]
                );
            }
            if (props.type === DATE_TYPE.datetimerange.name) {
                return !(activeRangePosition.value === LEFT_RANGE
                    ? tempCurrentValue.value[0]
                    : tempCurrentValue.value[1]);
            }
            return !tempCurrentValue.value[0];
        });

        watch(
            selectedDates,
            () => {
                if (DATE_TYPE[props.type].isRange) {
                    updateRangePosition(LEFT_RANGE);
                    tempCurrentValue.value = selectedDates.value || [];
                } else {
                    tempCurrentValue.value = [selectedDates.value];
                }
            },
            {
                immediate: true,
            },
        );

        const isCompleteSelected = () => {
            if (DATE_TYPE[props.type].isRange) {
                return (
                    tempCurrentValue.value.length === 2 &&
                    tempCurrentValue.value.every((item) => item)
                );
            }
            return !!tempCurrentValue.value[0];
        };

        const visibleFooter = computed(
            () => props.control || DATE_TYPE[props.type].hasTime,
        );

        const change = () => {
            if (isCompleteSelected()) {
                if (DATE_TYPE[props.type].isRange) {
                    updateRangePosition(LEFT_RANGE);
                    emit('change', tempCurrentValue.value);
                } else {
                    emit('change', tempCurrentValue.value[0]);
                }
            }
        };

        const updateTempCurrentValue = (val) => {
            tempCurrentValue.value = val;

            if (DATE_TYPE[props.type].isRange) {
                emit('tmpSelectedDateChange', tempCurrentValue.value);
            } else {
                emit('tmpSelectedDateChange', tempCurrentValue.value[0]);
            }

            if (!visibleFooter.value) {
                if (tempCurrentValue.value[0] && !tempCurrentValue.value[1]) {
                    updateRangePosition(RIGHT_RANGE);
                }
                change();
            }
        };

        watch(
            () => props.visible,
            () => {
                if (!props.visible && !isCompleteSelected()) {
                    if (DATE_TYPE[props.type].isRange) {
                        updateRangePosition(LEFT_RANGE);
                    }
                    updateTempCurrentValue([]);
                }
            },
        );

        const selectCurrentTime = () => {
            if (DATE_TYPE[props.type].isRange) {
                const format = DATE_TYPE[props.type].format;
                updateTempCurrentValue([
                    getTimestampFromFormat(null, format),
                    getTimestampFromFormat(null, format, true),
                ]);
            } else {
                updateTempCurrentValue([
                    getTimestampFromFormat(null, DATE_TYPE[props.type].format),
                ]);
            }
        };

        const confirm = () => {
            if (
                DATE_TYPE[props.type].isRange &&
                activeRangePosition.value === LEFT_RANGE
            ) {
                updateRangePosition(RIGHT_RANGE);
            } else if (isCompleteSelected()) {
                change();
            }
        };

        return {
            LEFT_RANGE,
            RIGHT_RANGE,
            prefixCls,
            tempCurrentValue,
            change,

            currentDateType,

            isDateRange,
            leftDefaultDate,
            rightDefaultDate,
            changeCurrentDate,

            isDateTimeRange,
            activeRangePosition,

            visibleFooter,
            selectCurrentTime,
            confirmDisabled,

            innerDisabledDate,

            rangeDiabledDate,

            updateTempCurrentValue,
            confirm,
        };
    },
};
</script>
