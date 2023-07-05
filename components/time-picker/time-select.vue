<template>
    <div :class="`${prefixCls}-content`" tabindex="0">
        <picker-item
            v-if="canSelectHours"
            :visible="visible"
            :times="canSelectHours"
            :value="selectedTime.hour"
            :focus="focusKey['1']"
            :class="`${prefixCls}-content-cell`"
            :visibleCount="visibleCount"
            @change="changeSelectedHour"
        />
        <picker-item
            v-if="canSelectMinutes"
            :visible="visible"
            :times="canSelectMinutes"
            :value="selectedTime.minute"
            :focus="focusKey['2']"
            :class="`${prefixCls}-content-cell`"
            :visibleCount="visibleCount"
            @change="changeSelectedMinute"
        />
        <picker-item
            v-if="canSelectSeconds"
            :visible="visible"
            :times="canSelectSeconds"
            :value="selectedTime.seconds"
            :focus="focusKey['4']"
            :class="`${prefixCls}-content-cell`"
            :visibleCount="visibleCount"
            @change="changeSelectedSeconds"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, PropType } from 'vue';
import {
    getHours,
    getMinutes,
    getSeconds,
    setHours,
    setMinutes,
    setSeconds,
} from 'date-fns';
import getPrefixCls from '../_util/getPrefixCls';
import PickerItem from './picker-item.vue';

import type { TimeOption } from './interface';

const prefixCls = getPrefixCls('time-picker');

function formatTime(
    total: number,
    step: number,
    disable?: (num: number) => boolean | undefined,
    format = true,
) {
    const formatData: TimeOption[] = [];
    for (let i = 0; i < total; i += step) {
        let label;
        if (format) {
            label = `${i}`.padStart(2, '0');
        } else {
            label = `${i}`;
        }
        formatData.push({
            disabled: disable && disable(i),
            value: i,
            label,
        });
    }
    return formatData;
}

export interface SelectedTime {
    hour: number | null;
    minute: number | null;
    seconds: number | null;
}

const timeSelectProps = {
    visible: {
        type: Boolean,
        default: false,
    },
    modelValue: Number,
    format: {
        type: String,
        default: 'HH:mm:ss',
    },
    hourStep: {
        type: Number,
        default: 1,
    },
    minuteStep: {
        type: Number,
        default: 1,
    },
    secondStep: {
        type: Number,
        default: 1,
    },
    disabledHours: {
        type: Function as PropType<(h: number) => boolean>,
    },
    disabledMinutes: {
        type: Function as PropType<(h: number, m: number) => boolean>,
    },
    disabledSeconds: {
        type: Function as PropType<
            (h: number, m: number, s: number) => boolean
        >,
    },
    visibleCount: {
        type: Number,
        default: 8,
    },
} as const;

export default defineComponent({
    components: {
        PickerItem,
    },
    props: timeSelectProps,
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const focusKey = reactive({
            1: -1,
            2: -1,
            4: -1,
        });

        const initialSelectedTime: SelectedTime = {
            hour: null,
            minute: null,
            seconds: null,
        };
        const selectedTime = reactive<SelectedTime>({ ...initialSelectedTime });

        const parseTime = () => {
            if (/H/.test(props.format)) {
                selectedTime.hour = props.modelValue
                    ? getHours(props.modelValue)
                    : null;
            }
            if (/m/.test(props.format)) {
                selectedTime.minute = props.modelValue
                    ? getMinutes(props.modelValue)
                    : null;
            }
            if (/s/.test(props.format)) {
                selectedTime.seconds = props.modelValue
                    ? getSeconds(props.modelValue)
                    : null;
            }
        };

        const setSelectedTimeDefault = () => {
            if (/H/.test(props.format) && !selectedTime.hour) {
                selectedTime.hour = 0;
            }
            if (/m/.test(props.format) && !selectedTime.minute) {
                selectedTime.minute = 0;
            }
            if (/s/.test(props.format) && !selectedTime.seconds) {
                selectedTime.seconds = 0;
            }
        };

        const canSelectHours = computed(() => {
            if (props.format.indexOf('H') !== -1) {
                return formatTime(
                    24,
                    props.hourStep,
                    (h) => props.disabledHours && props.disabledHours(h),
                    /HH/.test(props.format),
                );
            }
            return null;
        });
        const changeSelectedHour = (option: TimeOption) => {
            selectedTime.hour = option.value;
            setSelectedTimeDefault();
        };

        const canSelectMinutes = computed(() => {
            if (props.format.indexOf('m') !== -1) {
                return formatTime(
                    60,
                    props.minuteStep,
                    (m) =>
                        props.disabledMinutes &&
                        props.disabledMinutes(Number(selectedTime.hour), m),
                    /mm/.test(props.format),
                );
            }
            return null;
        });
        const changeSelectedMinute = (option: TimeOption) => {
            selectedTime.minute = option.value;
            setSelectedTimeDefault();
        };

        const canSelectSeconds = computed(() => {
            if (props.format.indexOf('s') !== -1) {
                return formatTime(
                    60,
                    props.secondStep,
                    (s) =>
                        props.disabledSeconds &&
                        props.disabledSeconds(
                            Number(selectedTime.hour),
                            Number(selectedTime.minute),
                            s,
                        ),
                    /ss/.test(props.format),
                );
            }
            return null;
        });
        const changeSelectedSeconds = (option: TimeOption) => {
            selectedTime.seconds = option.value;
            setSelectedTimeDefault();
        };

        const timestamp = computed(() => {
            let currentTime = new Date(props.modelValue);
            const { hour, minute, seconds } = selectedTime;
            if (/H/.test(props.format) && hour != null) {
                currentTime = setHours(currentTime, hour);
            }
            if (/m/.test(props.format) && minute != null) {
                currentTime = setMinutes(currentTime, minute);
            }
            if (/s/.test(props.format) && seconds != null) {
                currentTime = setSeconds(currentTime, seconds);
            }
            return currentTime.getTime();
        });
        watch(timestamp, () => {
            emit('update:modelValue', timestamp.value);
            emit('change', timestamp.value);
        });

        watch(
            () => props.modelValue,
            () => {
                if (timestamp.value !== props.modelValue) {
                    parseTime();
                }
            },
            {
                immediate: true,
            },
        );

        return {
            prefixCls,
            canSelectHours,
            canSelectMinutes,
            canSelectSeconds,
            changeSelectedHour,
            changeSelectedMinute,
            changeSelectedSeconds,
            focusKey,
            selectedTime,
        };
    },
});
</script>
