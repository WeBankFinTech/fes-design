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
import {
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    reactive,
    watch,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import PickerItem from './picker-item.vue';

import type { TimeOption } from './interface';

const prefixCls = getPrefixCls('time-picker');

// #1023: import.meta.env 仅在 vite/vitest 等构建环境下存在；
// ?. 守卫保证 rollup/esm 产物在无 process 的浏览器环境不抛错
const isDev = import.meta.env?.DEV;

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

export interface SelectedTime {
    hour: string | null;
    minute: string | null;
    seconds: string | null;
}

const timeSelectProps = {
    visible: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        // #1023: 仅支持字符串（HH:mm:ss 等）；非字符串值将被忽略并
        // 在开发模式下告警，而不是抛错
        type: String,
        default: '',
    },
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
} as const satisfies ComponentObjectPropsOptions;
// 初始选择的时间
const initialSelectedTime: SelectedTime = {
    hour: null,
    minute: null,
    seconds: null,
};

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

        // 被选中的时间
        const selectedTime = reactive<SelectedTime>({ ...initialSelectedTime });

        const formatSingleTime = (timeFormat: string) =>
            props.format.indexOf(timeFormat) !== -1 ? '00' : '0';

        // 重置时间
        const resetTime = () => {
            Object.assign(selectedTime, initialSelectedTime);
        };

        // 解析时间
        const parseTime = () => {
            // #1023: modelValue 类型防御——非字符串（如数组/数字/
            // 对象）按空值处理，避免 props.modelValue.split 抛
            // TypeError 导致整页白屏；null/undefined/空数组视为
            // 空值静默处理，其余非字符串在开发模式下告警
            if (typeof props.modelValue !== 'string') {
                const isEmptyValue
                    = props.modelValue == null
                    || (Array.isArray(props.modelValue)
                        && props.modelValue.length === 0);
                if (!isEmptyValue && isDev) {
                    console.warn(
                        '[FTimeSelect]: modelValue 仅支持字符串类型，当前值将被忽略:',
                        props.modelValue,
                    );
                }
                Object.assign(selectedTime, initialSelectedTime);
                return;
            }
            if (!props.modelValue) {
                Object.assign(selectedTime, initialSelectedTime);
                return;
            }
            const splitTime = props.modelValue.split(':');
            if (/H/.test(props.format)) {
                selectedTime.hour = splitTime.shift() || formatSingleTime('HH');
            }
            if (/m/.test(props.format)) {
                selectedTime.minute
                    = splitTime.shift() || formatSingleTime('mm');
            }
            if (/s/.test(props.format)) {
                selectedTime.seconds
                    = splitTime.shift() || formatSingleTime('ss');
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
                        props.disabledMinutes
                        && props.disabledMinutes(Number(selectedTime.hour), m),
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
                        props.disabledSeconds
                        && props.disabledSeconds(
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
            // 判等守卫：timeString 与外部 modelValue 一致时（如组件重建后
            // watch(modelValue, immediate) 首跑重放 parseTime 的场景），
            // 不再回显广播，避免同值事件噪声参与父级更新环（#1029）
            if (timeString.value === props.modelValue) {
                return;
            }
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
            resetTime,
        };
    },
});
</script>
