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
                @focus="(e: Event) => $emit('focus', e)"
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

<script setup lang="ts">
import { computed, ref, watch, Ref } from 'vue';
import RangeInput from './rangeInput.vue';
import Calendars from './calendars.vue';
import WInput from '../input';
import Popper from '../popper';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import { DateOutlined, SwapRightOutlined } from '../icon';

import { isEmptyValue, timeFormat } from './helper';
import { DATE_TYPE } from './const';

import type {
    VModelEvent,
    ChangeEvent,
    GetContainer,
} from '../_util/interface';
import type { CommonProps, RangeProps } from './interface';

type DatePickerProps = CommonProps &
    RangeProps & {
        open?: boolean;
        disabled?: boolean;
        clearable?: boolean;
        placeholder?: string | string[];
        appendToContainer?: boolean;
        getContainer?: GetContainer;
        format?: string;
        popperClass?: string;
        control?: boolean;
        shortcuts?: object;
        disabledDate?: (date: Date) => boolean;
    };

type DatePickerEmits = {
    (e: VModelEvent, value: number | number[]): void;
    (e: ChangeEvent, value: number | number[] | null): void;
    (e: 'update:open', open: boolean): void;
    (e: 'clear'): void;
    (e: 'focus', event: Event): void;
    (e: 'blur', event: Event): void;
};

const props = withDefaults(defineProps<DatePickerProps>(), {
    type: DATE_TYPE.date.name,
    disabledDate: () => false,
    disabledTime: () => false,
    control: false,
});

const emit = defineEmits<DatePickerEmits>();

const useTmpSelectedDates = () => {
    const tmpSelectedDates = ref();

    const tmpSelectedDateChange = (val: number | null | number[]) => {
        tmpSelectedDates.value = val;
    };

    return {
        tmpSelectedDates,
        tmpSelectedDateChange,
    };
};

const useInput = (props: DatePickerProps, visibleValue: Ref<number>) => {
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

useTheme();
const [isOpened, updatePopperOpen] = useNormalModel(props, emit, {
    prop: 'open',
});
const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

const isRange = computed(() => DATE_TYPE[props.type].isRange);
const { validate } = useFormAdaptor(
    computed(() => (isRange.value ? 'array' : 'number')),
);

const { tmpSelectedDates, tmpSelectedDateChange } = useTmpSelectedDates();

const visibleValue = computed(() => {
    if (isOpened.value) {
        return isEmptyValue(tmpSelectedDates.value)
            ? currentValue.value
            : tmpSelectedDates.value;
    }
    return currentValue.value;
});

const { resetDateText, dateText } = useInput(props, visibleValue);

const handleChange = (val: number | number[] | null) => {
    emit('change', val);
    validate('change');
};
// 事件
const clear = () => {
    const initValue: [] | null = isRange.value ? [] : null;
    tmpSelectedDateChange(initValue);
    updateCurrentValue(initValue);
    emit('clear');
    handleChange(initValue);
};

const change = (val: number | number[] | null) => {
    updateCurrentValue(val);
    handleChange(val);
    updatePopperOpen(false);
};

const handleBlur = (e: Event) => {
    updatePopperOpen(false);
    emit('blur', e);
    validate('blur');
    // 重置输入框内容
    resetDateText();
};
</script>

<script>
export default {
    name: 'FDatePicker',
};
</script>
