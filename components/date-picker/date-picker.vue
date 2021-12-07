<template>
    <Popper
        v-model="isOpened"
        :disabled="disabled"
        :appendToContainer="appendToContainer"
        :getContainer="getContainer"
        :popperClass="popperClass"
        trigger="click"
        :hideAfter="0"
        placement="bottom-start"
        :offset="4"
    >
        <template #trigger>
            <RangeInput
                v-if="isRange"
                :type="type"
                :selectedDates="visibleValue"
                :placeholder="placeholder"
                :clearable="clearable"
                :disabled="disabled"
                @focus="(e) => $emit('focus', e)"
                @blur="handleBlur"
                @clear="clear"
                @click="isOpened = true"
            >
                <template #separator>
                    <slot v-if="$slots.separator" name="separator"></slot>
                    <SwapRightOutlined v-else />
                </template>
                <template #suffix>
                    <slot v-if="$slots.suffixIcon" name="suffixIcon"></slot>
                    <DateOutlined v-else />
                </template>
            </RangeInput>
            <WInput
                v-else
                ref="inputRef"
                v-model="dateText"
                :placeholder="placeholder"
                :disabled="disabled"
                :clearable="clearable"
                @focus="(e) => $emit('focus', e)"
                @blur="handleBlur"
                @clear="clear"
                @click="isOpened = true"
            >
                <template #suffix>
                    <slot v-if="$slots.suffixIcon" name="suffixIcon"></slot>
                    <DateOutlined v-else />
                </template>
            </WInput>
        </template>
        <template #default>
            <calendars
                :visible="isOpened"
                :modelValue="currentValue"
                :type="type"
                :control="control"
                :shortcuts="shortcuts"
                :minDate="minDate"
                :maxDate="maxDate"
                :maxRange="maxRange"
                :disabledDate="disabledDate"
                :disabledTime="disabledTime"
                @change="change"
                @tmpSelectedDateChange="tmpSelectedDateChange"
                @mousedown.prevent
            />
        </template>
    </Popper>
</template>

<script>
import { computed, ref, watch } from 'vue';
import RangeInput from './rangeInput';
import Calendars from './calendars';
import WInput from '../input';
import Popper from '../popper';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { DateOutlined, SwapRightOutlined } from '../icon';

import { isEmptyValue, timeFormat } from './helper';
import { COMMON_PROPS, CALENDARS_PROPS, RANGE_PROPS, DATE_TYPE } from './const';

const prefixCls = getPrefixCls('date-picker');

const useTmpSelectedDates = () => {
    const tmpSelectedDates = ref();

    const tmpSelectedDateChange = (val) => {
        tmpSelectedDates.value = val;
    };

    return {
        tmpSelectedDates,
        tmpSelectedDateChange,
    };
};

const useInput = (props, visibleValue) => {
    const dateText = ref();

    const getFormatDate = () => {
        if (isEmptyValue(visibleValue.value)) {
            return '';
        }
        if (!DATE_TYPE[props.type].isRange) {
            return timeFormat(visibleValue.value, DATE_TYPE[props.type].format);
        }
        return '';
    };
    const resetDateText = () => {
        dateText.value = getFormatDate();
    };
    watch(visibleValue, resetDateText, {
        immediate: true,
    });

    return {
        resetDateText,
        dateText,
    };
};

export default {
    name: 'FDatePicker',
    components: {
        Calendars,
        WInput,
        Popper,
        DateOutlined,
        RangeInput,
        SwapRightOutlined,
    },
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: [String, Array],
            default: '请选择日期',
        },
        appendToContainer: {
            type: Boolean,
            default: true,
        },
        getContainer: {
            type: Function,
        },
        format: String,
        popperClass: String,

        ...COMMON_PROPS,
        ...CALENDARS_PROPS,
        ...RANGE_PROPS,
    },
    emits: ['update:modelValue', 'update:open', 'change', 'clear', 'blur', 'focus'],
    setup(props, { emit }) {
        const [isOpened, updatePopperOpen] = useNormalModel(props, emit, {
            prop: 'open',
        });
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const isRange = computed(() => DATE_TYPE[props.type].isRange);
        const { validate } = useFormAdaptor(computed(() => (isRange.value ? 'array' : 'number')));

        const { tmpSelectedDates, tmpSelectedDateChange } = useTmpSelectedDates(isOpened);

        const visibleValue = computed(() => {
            if (isOpened.value) {
                return isEmptyValue(tmpSelectedDates.value) ? currentValue.value : tmpSelectedDates.value;
            }
            return currentValue.value;
        });

        const { resetDateText, dateText } = useInput(props, visibleValue);

        const handleChange = (val) => {
            emit('change', val);
            validate('change');
        };
        // 事件
        const clear = () => {
            const initValue = isRange.value ? [] : null;
            tmpSelectedDateChange(initValue);
            updateCurrentValue(initValue);
            emit('clear', initValue);
            handleChange(initValue);
        };

        const change = (val) => {
            updateCurrentValue(val);
            handleChange(val);
            updatePopperOpen(false);
        };

        const handleBlur = (e) => {
            updatePopperOpen(false);
            emit('blur', e);
            validate('blur');
            // 重置输入框内容
            resetDateText();
        };

        return {
            prefixCls,
            isOpened,
            currentValue,
            visibleValue,

            dateText,
            isRange,

            clear,
            change,
            handleBlur,

            tmpSelectedDateChange,
        };
    },
};
</script>
