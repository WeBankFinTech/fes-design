<template>
    <div :class="prefixCls">
        <div>
            <div v-if="pickerRef.isRange" :class="`${prefixCls}-daterange`">
                <Calendar
                    :modelValue="tempCurrentValue"
                    :type="type"
                    :disabledTime="disabledTime"
                    :disabledDate="rangeDisabledDate"
                    :rangePosition="RANGE_POSITION.LEFT"
                    :activeDate="leftActiveDate"
                    :selectedStatus="selectedStatus"
                    :hourStep="hourStep"
                    :minuteStep="minuteStep"
                    :secondStep="secondStep"
                    :defaultTime="defaultTime"
                    @change="updateTempCurrentValue"
                    @selectedDay="selectedDay(RANGE_POSITION.LEFT)"
                    @update:activeDate="
                        (timestamp) =>
                            changeCurrentDate(timestamp, RANGE_POSITION.LEFT)
                    "
                />
                <Calendar
                    :modelValue="tempCurrentValue"
                    :type="type"
                    :disabledTime="disabledTime"
                    :disabledDate="rangeDisabledDate"
                    :rangePosition="RANGE_POSITION.RIGHT"
                    :activeDate="rightActiveDate"
                    :selectedStatus="selectedStatus"
                    :hourStep="hourStep"
                    :minuteStep="minuteStep"
                    :secondStep="secondStep"
                    :defaultTime="defaultTime"
                    @change="updateTempCurrentValue"
                    @selectedDay="selectedDay(RANGE_POSITION.RIGHT)"
                    @update:activeDate="
                        (timestamp) =>
                            changeCurrentDate(timestamp, RANGE_POSITION.RIGHT)
                    "
                />
            </div>
            <Calendar
                v-else
                v-model:activeDate="defaultActiveDate"
                :modelValue="tempCurrentValue"
                :type="type"
                :disabledTime="disabledTime"
                :disabledDate="innerDisabledDate"
                :hourStep="hourStep"
                :minuteStep="minuteStep"
                :secondStep="secondStep"
                :defaultTime="defaultTime"
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
            @mousedown.prevent
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
import { useNormalModel } from '../_util/use/useModel';
import FButton from '../button';
import { useLocale } from '../config-provider/useLocale';
import Calendar from './calendar.vue';
import { getTimestampFromFormat } from './helper';
import { RANGE_POSITION, COMMON_PROPS, RANGE_PROPS } from './const';

import { useRange, useSelectStatus } from './useRange';
import { useDisable } from './use';
import { PickerType, pickerFactory } from './pickerHandler';

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

        const pickerRef = computed(() => {
            return pickerFactory(props.type);
        });

        const tempCurrentValue = ref<number[]>([]);

        const { innerDisabledDate } = useDisable(props);

        const { t } = useLocale();

        const currentText = computed(() => {
            const confirmLang = pickerRef.value.confirmLang;
            return confirmLang ? t(confirmLang) : '';
        });

        const { selectedStatus, selectedDay, lastSelectedPosition } =
            useSelectStatus(props);
        const {
            leftActiveDate,
            rightActiveDate,
            changeCurrentDate,
            rangeDisabledDate,
            resetActiveDate,
        } = useRange({
            props,
            tempCurrentValue,
            innerDisabledDate,
            selectedStatus,
            lastSelectedPosition,
            picker: pickerRef,
        });

        const confirmDisabled = computed(() => {
            if (pickerRef.value.isRange) {
                return !tempCurrentValue.value.length;
            }

            if (pickerRef.value.name === PickerType.datemultiple) {
                return false;
            }

            return !tempCurrentValue.value[0];
        });

        const visibleFooter = computed(
            () =>
                props.control ||
                pickerRef.value.name === PickerType.datemultiple ||
                pickerRef.value.isRange ||
                pickerRef.value.hasTime,
        );

        const change = () => {
            if (
                pickerRef.value.isRange ||
                pickerRef.value.name === PickerType.datemultiple
            ) {
                emit('change', tempCurrentValue.value);
            } else {
                emit('change', tempCurrentValue.value[0]);
            }
        };

        const updateTempCurrentValue = (val: number[]) => {
            tempCurrentValue.value = val;

            if (
                pickerRef.value.isRange ||
                pickerRef.value.name === PickerType.datemultiple
            ) {
                emit('tmpSelectedDateChange', tempCurrentValue.value);
            } else {
                emit('tmpSelectedDateChange', tempCurrentValue.value[0]);
            }

            if (!visibleFooter.value) {
                change();
            }
        };

        const handleTempCurrentValue = () => {
            if (isArray(selectedDates.value)) {
                tempCurrentValue.value = selectedDates.value;
            } else {
                tempCurrentValue.value = selectedDates.value
                    ? [selectedDates.value]
                    : [];
            }
        };
        watch(selectedDates, handleTempCurrentValue, {
            deep: true,
        });
        const defaultActiveDate = ref(Date.now());
        watch(
            () => props.visible,
            () => {
                if (props.visible) {
                    handleTempCurrentValue();
                    if (tempCurrentValue.value.length) {
                        if (pickerRef.value.isRange) {
                            resetActiveDate();
                        } else {
                            defaultActiveDate.value = tempCurrentValue.value[0];
                        }
                    }
                }
            },
            {
                immediate: true,
            },
        );

        const selectCurrentTime = () => {
            if (pickerRef.value.isRange) {
                // FEATURE：时间范围的没想清楚怎么处理，后续优化
                const format = pickerRef.value.format;
                updateTempCurrentValue([
                    getTimestampFromFormat(null, format),
                    getTimestampFromFormat(null, format, true),
                ]);
            } else {
                updateTempCurrentValue([
                    getTimestampFromFormat(null, pickerRef.value.format),
                ]);
                change();
            }
        };

        const confirm = () => {
            change();
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

            pickerRef,

            leftActiveDate,
            rightActiveDate,
            changeCurrentDate,

            visibleFooter,
            selectCurrentTime,
            confirmDisabled,

            innerDisabledDate,

            rangeDisabledDate,

            selectedStatus,
            selectedDay,

            updateTempCurrentValue,
            confirm,

            t,
            currentText,
            handleShortcut,
            defaultActiveDate,
        };
    },
});
</script>
