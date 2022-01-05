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

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import PickerItem from './picker-item.vue';
import getPrefixCls from '../_util/getPrefixCls';

import type { VModelEvent, ChangeEvent } from '../_util/interface';
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
        let value;
        if (format) {
            value = `${i}`.padStart(2, '0');
        } else {
            value = `${i}`;
        }
        formatData.push({
            disabled: disable && disable(Number(value)),
            value,
        });
    }
    return formatData;
}

type TimeSelectProps = {
    visible?: boolean;
    modelValue?: string;
    format?: string;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    disabledHours?: (h: number) => boolean;
    disabledMinutes?: (h: number, m: number) => boolean;
    disabledSeconds?: (h: number, m: number, s: number) => boolean;
    visibleCount?: number;
};

type TimeSelectEmits = {
    (e: VModelEvent, value: string): void;
    (e: ChangeEvent, value: string): void;
};

const props = withDefaults(defineProps<TimeSelectProps>(), {
    visible: false,
    format: 'HH:mm:ss',
    hourStep: 1,
    minuteStep: 1,
    secondStep: 1,
    visibleCount: 8,
});

const emit = defineEmits<TimeSelectEmits>();

const focusKey = reactive({
    1: -1,
    2: -1,
    4: -1,
});

export interface SelectedTime {
    hour: string | null;
    minute: string | null;
    seconds: string | null;
}
const initialSelectedTime: SelectedTime = {
    hour: null,
    minute: null,
    seconds: null,
};
const selectedTime = reactive<SelectedTime>({ ...initialSelectedTime });
const formatSingleTime = (timeFormat: string) =>
    props.format.indexOf(timeFormat) !== -1 ? '00' : '0';
const parseTime = () => {
    if (!props.modelValue) {
        Object.assign(selectedTime, initialSelectedTime);
        return;
    }
    const splitTime = props.modelValue.split(':');
    if (/H/.test(props.format)) {
        selectedTime.hour = splitTime.shift() || formatSingleTime('HH');
    }
    if (/m/.test(props.format)) {
        selectedTime.minute = splitTime.shift() || formatSingleTime('mm');
    }
    if (/s/.test(props.format)) {
        selectedTime.seconds = splitTime.shift() || formatSingleTime('ss');
    }
};

const setSelectedTimeDefault = () => {
    if (/H/.test(props.format) && !selectedTime.hour) {
        selectedTime.hour = formatSingleTime('HH');
    }
    if (/m/.test(props.format) && !selectedTime.minute) {
        selectedTime.minute = formatSingleTime('mm');
    }
    if (/s/.test(props.format) && !selectedTime.seconds) {
        selectedTime.seconds = formatSingleTime('ss');
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

const timeString = computed(() => {
    let currentTime = '';
    const { hour, minute, seconds } = selectedTime;
    if (!(hour || minute || seconds)) {
        return currentTime;
    }
    if (/H/.test(props.format)) {
        currentTime += hour;
    }
    if (/m/.test(props.format)) {
        currentTime += currentTime.length > 0 ? `:${minute}` : minute;
    }
    if (/s/.test(props.format)) {
        currentTime += currentTime.length > 0 ? `:${seconds}` : seconds;
    }
    return currentTime;
});
watch(timeString, () => {
    emit('update:modelValue', timeString.value);
    emit('change', timeString.value);
});

watch(
    () => props.modelValue,
    () => {
        if (timeString.value !== props.modelValue) {
            parseTime();
        }
    },
    {
        immediate: true,
    },
);
</script>
