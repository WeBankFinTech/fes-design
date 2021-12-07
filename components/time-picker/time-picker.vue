<template>
    <Popper
        v-model="isOpened"
        trigger="click"
        placement="bottom-start"
        :popperClass="`${prefixCls}-popper`"
        :disabled="disabled"
        :appendToContainer="appendToContainer"
        :getContainer="getContainer"
        :hideAfter="0"
        :offset="4"
    >
        <template #trigger>
            <FInput
                v-if="!isRange"
                :class="classes"
                :modelValue="tempValue || displayValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :clearable="clearable"
                @clear="clear"
                @input="handleInput"
                @change="handleChange"
                @focus="(event) => $emit('focus', event)"
                @blur="handleBlur"
            >
                <template #suffix>
                    <ClockCircleOutlined />
                </template>
            </FInput>
        </template>
        <template #default>
            <div :class="`${prefixCls}-dropdown`" @mousedown.prevent>
                <TimeSelect
                    :visible="isOpened"
                    :modelValue="displayValue"
                    :format="format"
                    :hour-step="hourStep"
                    :minute-step="minuteStep"
                    :second-step="secondStep"
                    :disabled-hours="disabledHours"
                    :disabled-minutes="disabledMinutes"
                    :disabled-seconds="disabledSeconds"
                    @change="changeTime"
                />
                <div v-if="showControl" :class="`${prefixCls}-addon`">
                    <slot name="addon" :activeTime="activeTime">
                        <div :class="`${prefixCls}-addon-inner`">
                            <FButton type="link" size="small" @mousedown.prevent @click="setCurrentTime">此刻</FButton>
                            <FButton type="primary" size="small" @mousedown.prevent @click="confirmChangeTime">确认</FButton>
                        </div>
                    </slot>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import TimeSelect from './time-select';
import FInput from '../input';
import { ClockCircleOutlined } from '../icon';
import Popper from '../popper';
import FButton from '../button';

const prefixCls = getPrefixCls('time-picker');

// TODO 支持 12 小时制
function formatTimeCell(data) {
    return `${data}`.padStart(2, '0');
}

const getCurrentTime = (format) => {
    const date = new Date();
    return [
        format.indexOf('H') !== -1 && formatTimeCell(date.getHours()),
        format.indexOf('m') !== -1 && formatTimeCell(date.getMinutes()),
        format.indexOf('s') !== -1 && formatTimeCell(date.getSeconds()),
    ]
        .filter(Boolean)
        .join(':');
};

function validator(val, cellFormat, format, max) {
    if (!val) return false;
    if (val.length > 3 || !/^\d{1,2}$/.test(val) || Number(val) > max || (format.indexOf(cellFormat) === -1 && val.startsWith('0'))) {
        return false;
    }
    return true;
}

function validateTime(data, format) {
    const times = data.split(':');
    if (/H/.test(format)) {
        if (!validator(times.shift(), 'HH', format, 23)) return false;
    }
    if (/m/.test(format)) {
        if (!validator(times.shift(), 'mm', format, 59)) return false;
    }
    if (/s/.test(format)) {
        if (!validator(times.shift(), 'ss', format, 59)) return false;
    }
    if (times.length) return false;
    return true;
}

function useOpen(props, emit) {
    const [isOpened, updateCurrentValue] = useNormalModel(props, emit, {
        prop: 'open',
    });
    const closePopper = () => {
        updateCurrentValue(false);
    };
    return {
        isOpened,
        closePopper,
    };
}

export default {
    name: 'FTimePicker',
    components: {
        TimeSelect,
        FInput,
        Popper,
        ClockCircleOutlined,
        FButton,
    },
    props: {
        modelValue: {
            type: [String, Array],
            default: '',
        },
        open: {
            type: Boolean,
            default: false,
        },
        appendToContainer: {
            type: Boolean,
            default: true,
        },
        getContainer: {
            type: Function,
        },
        placeholder: {
            type: [String, Array],
            default: '',
        },
        // FEATURE 下个版本实现
        isRange: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: true,
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
        disabledHours: Function,
        disabledMinutes: Function,
        disabledSeconds: Function,
        control: {
            type: Boolean,
            default: true,
        },
    },
    emits: [UPDATE_MODEL_EVENT, 'update:open', 'change', 'blur', 'focus'],
    setup(props, { emit, slots }) {
        const { validate } = useFormAdaptor();
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
        const { isOpened, closePopper } = useOpen(props, emit);
        const classes = computed(() => [prefixCls, props.disabled && 'is-disabled'].filter(Boolean));

        const showControl = computed(() => props.control || slots.addon);

        const tempValue = ref();
        const displayValue = computed(() => {
            if (props.isRange) {
                return currentValue.value || [];
            }
            return currentValue.value || '';
        });

        const setCurrentValue = (val) => {
            updateCurrentValue(val);
            emit('change', val);
            validate('change');
        };
        const clear = () => {
            setCurrentValue('');
        };

        const activeTime = ref();
        const changeTime = (val) => {
            activeTime.value = val;
        };
        watch(isOpened, () => {
            if (!isOpened.value && !showControl.value && activeTime.value) {
                setCurrentValue(activeTime.value);
            }
        });

        // const inputactiveTime
        const handleInput = (val) => {
            tempValue.value = val;
        };
        const handleChange = (val) => {
            if (validateTime(val, props.format)) {
                setCurrentValue(val);
            } else {
                setCurrentValue(currentValue.value);
            }
            tempValue.value = null;
        };

        const setCurrentTime = () => {
            setCurrentValue(getCurrentTime(props.format));
            closePopper();
        };
        const confirmChangeTime = () => {
            setCurrentValue(activeTime.value);
            closePopper();
        };

        const handleBlur = (event) => {
            closePopper();
            emit('blur', event);
            validate('blur');
        };

        return {
            prefixCls,
            classes,
            displayValue,
            isOpened,

            tempValue,

            handleInput,
            handleChange,
            handleBlur,
            clear,
            changeTime,
            showControl,
            setCurrentTime,
            confirmChangeTime,

            activeTime,
        };
    },
};
</script>
