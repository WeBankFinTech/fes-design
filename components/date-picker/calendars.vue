<template>
    <div :class="prefixCls">
        <div>
            <div v-if="isDateRange" :class="`${prefixCls}-daterange`">
                <Calendar
                    :modelValue="tempCurrentValue"
                    :type="type"
                    :disabledTime="disabledTime"
                    :disabledDate="rangeDiabledDate"
                    :rangePosition="RANGE_POSITION.LEFT"
                    :defaultDate="leftDefaultDate"
                    :selectedStatus="selectedStatus"
                    @change="updateTempCurrentValue"
                    @selectedDay="selectedDay"
                    @changeCurrentDate="
                        (timestamp) =>
                            changeCurrentDate(timestamp, RANGE_POSITION.LEFT)
                    "
                />
                <Calendar
                    :modelValue="tempCurrentValue"
                    :type="type"
                    :disabledTime="disabledTime"
                    :disabledDate="rangeDiabledDate"
                    :rangePosition="RANGE_POSITION.RIGHT"
                    :defaultDate="rightDefaultDate"
                    :selectedStatus="selectedStatus"
                    @change="updateTempCurrentValue"
                    @selectedDay="selectedDay"
                    @changeCurrentDate="
                        (timestamp) =>
                            changeCurrentDate(timestamp, RANGE_POSITION.RIGHT)
                    "
                />
            </div>
            <Calendar
                v-else
                :modelValue="tempCurrentValue"
                :type="type"
                :disabledTime="disabledTime"
                :disabledDate="innerDisabledDate"
                @change="updateTempCurrentValue"
            />
            <div v-if="visibleFooter" :class="`${prefixCls}-footer`">
                <div :class="`${prefixCls}-footer-inner`">
                    <FButton
                        v-if="currentText"
                        type="link"
                        size="small"
                        @click="selectCurrentTime"
                    >
                        {{ currentText }}
                    </FButton>
                    <FButton
                        :disabled="confirmDisabled"
                        type="primary"
                        size="small"
                        @click="confirm"
                    >
                        {{ t('datePicker.confirm') }}
                    </FButton>
                </div>
            </div>
        </div>
        <ul
            v-if="shortcuts && Object.keys(shortcuts).length"
            :class="`${prefixCls}-shortcuts`"
        >
            <li
                v-for="(val, name) in shortcuts"
                :key="name"
                @click="handleShortcut(val)"
            >
                {{ name }}
            </li>
        </ul>
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
import { isFunction, isArray, isNumber } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import Calendar from './calendar.vue';
import { useNormalModel } from '../_util/use/useModel';
import FButton from '../button';
import { contrastDate, getTimestampFromFormat } from './helper';
import {
    DATE_TYPE,
    RANGE_POSITION,
    COMMON_PROPS,
    RANGE_PROPS,
    DATE_TYPE_CURRENT,
} from './const';

import { useRange, useSelectStatus } from './useRange';
import { useLocale } from '../config-provider/useLocale';

const prefixCls = getPrefixCls('calendars');

const calendarsProps = {
    ...COMMON_PROPS,
    ...RANGE_PROPS,
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
} as const;

export type CalendarsProps = Partial<ExtractPropTypes<typeof calendarsProps>>;

export default defineComponent({
    name: 'FCalendars',
    components: {
        Calendar,
        FButton,
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

        const { t } = useLocale();

        const currentText = computed(() => {
            let currentText = '';
            switch (currentDateType.value.currentText) {
                case DATE_TYPE_CURRENT.now:
                    currentText = t('datePicker.now');
                    break;
                case DATE_TYPE_CURRENT.today:
                    currentText = t('datePicker.today');
                    break;
                case DATE_TYPE_CURRENT.currentYear:
                    currentText = t('datePicker.currentYear');
                    break;
                case DATE_TYPE_CURRENT.currentMonth:
                    currentText = t('datePicker.currentMonth');
                    break;
                case DATE_TYPE_CURRENT.currentQuarter:
                    currentText = t('datePicker.currentQuarter');
                    break;
                default:
                    break;
            }
            return currentText;
        });

        const {
            isDateRange,

            leftDefaultDate,
            rightDefaultDate,
            changeCurrentDate,
            rangeDiabledDate,
        } = useRange(props, tempCurrentValue, innerDisabledDate);
        const { selectedStatus, selectedDay } = useSelectStatus(props);

        const confirmDisabled = computed(() => {
            if (DATE_TYPE[props.type].isRange) {
                return !tempCurrentValue.value.length;
            }

            return !tempCurrentValue.value[0];
        });

        watch(
            selectedDates,
            () => {
                if (DATE_TYPE[props.type].isRange) {
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
            () =>
                props.control ||
                DATE_TYPE[props.type].isRange ||
                DATE_TYPE[props.type].hasTime,
        );

        const change = () => {
            if (isCompleteSelected()) {
                if (DATE_TYPE[props.type].isRange) {
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
                change();
            }
        };

        watch(
            () => props.visible,
            () => {
                if (!props.visible && !isCompleteSelected()) {
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
            if (isCompleteSelected()) {
                change();
            }
        };

        const handleShortcut = (val: any) => {
            if (isFunction(val)) {
                val = val();
            }
            if (isArray(val)) {
                tempCurrentValue.value = val;
            } else if (isNumber(val)) {
                tempCurrentValue.value = [val];
            }
            change();
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

            visibleFooter,
            selectCurrentTime,
            confirmDisabled,

            innerDisabledDate,

            rangeDiabledDate,

            selectedStatus,
            selectedDay,

            updateTempCurrentValue,
            confirm,

            t,
            currentText,
            handleShortcut,
        };
    },
});
</script>
