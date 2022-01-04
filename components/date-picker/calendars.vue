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
                :rangePosition="RANGE_POSITION.LEFT"
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
                :rangePosition="RANGE_POSITION.RIGHT"
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
                activeRangePosition === RANGE_POSITION.LEFT
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

<script lang="ts">
import {
    ref,
    computed,
    watch,
    defineComponent,
    PropType,
    ExtractPropTypes,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import Calendar from './calendar.vue';
import { useNormalModel } from '../_util/use/useModel';
import WButton from '../button';
import { contrastDate, getTimestampFromFormat } from './helper';
import { DATE_TYPE, RANGE_POSITION, COMMON_PROPS, RANGE_PROPS } from './const';

import { useRange } from './useRange';

const prefixCls = getPrefixCls('calendars');

const calendarsProps = {
    visible: {
        type: Boolean,
        default: false,
    },
    disabledDate: {
        type: Function as PropType<(date: Date) => boolean>,
        default: () => false,
    },
    control: Boolean,
    shortcuts: Object,
    ...COMMON_PROPS,
    ...RANGE_PROPS,
} as const;

export type CalendarsProps = Partial<ExtractPropTypes<typeof calendarsProps>>;

export default defineComponent({
    name: 'FCalendars',
    components: {
        Calendar,
        WButton,
    },
    props: calendarsProps,
    emits: ['update:modelValue', 'tmpSelectedDateChange', 'change'],
    setup(props, { emit }) {
        const [selectedDates] = useNormalModel(props, emit);
        const currentDateType = computed(() => DATE_TYPE[props.type]);

        const tempCurrentValue = ref<number[]>([]);

        const innerDisabledDate = (date: Date, format: string) => {
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
                return !(activeRangePosition.value === RANGE_POSITION.LEFT
                    ? tempCurrentValue.value[0]
                    : tempCurrentValue.value[1]);
            }
            return !tempCurrentValue.value[0];
        });

        watch(
            selectedDates,
            () => {
                if (DATE_TYPE[props.type].isRange) {
                    updateRangePosition(RANGE_POSITION.LEFT);
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
                    updateRangePosition(RANGE_POSITION.LEFT);
                    emit('change', tempCurrentValue.value);
                } else {
                    emit('change', tempCurrentValue.value[0]);
                }
            }
        };

        const updateTempCurrentValue = (val: number[]) => {
            tempCurrentValue.value = val;

            if (DATE_TYPE[props.type].isRange) {
                emit('tmpSelectedDateChange', tempCurrentValue.value);
            } else {
                emit('tmpSelectedDateChange', tempCurrentValue.value[0]);
            }

            if (!visibleFooter.value) {
                if (tempCurrentValue.value[0] && !tempCurrentValue.value[1]) {
                    updateRangePosition(RANGE_POSITION.RIGHT);
                }
                change();
            }
        };

        watch(
            () => props.visible,
            () => {
                if (!props.visible && !isCompleteSelected()) {
                    if (DATE_TYPE[props.type].isRange) {
                        updateRangePosition(RANGE_POSITION.LEFT);
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
                activeRangePosition.value === RANGE_POSITION.LEFT
            ) {
                updateRangePosition(RANGE_POSITION.RIGHT);
            } else if (isCompleteSelected()) {
                change();
            }
        };

        return {
            RANGE_POSITION,
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
});
</script>
