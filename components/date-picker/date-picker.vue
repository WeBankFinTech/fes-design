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

<script lang="ts">
import {
    computed,
    ref,
    watch,
    Ref,
    defineComponent,
    PropType,
    ExtractPropTypes,
} from 'vue';
import RangeInput from './rangeInput.vue';
import Calendars from './calendars.vue';
import WInput from '../input';
import Popper from '../popper';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { useNormalModel } from '../_util/use/useModel';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { DateOutlined, SwapRightOutlined } from '../icon';

import { isEmptyValue, timeFormat } from './helper';
import { DATE_TYPE, COMMON_PROPS, RANGE_PROPS } from './const';

import type { GetContainer } from '../_util/interface';

const prefixCls = getPrefixCls('date-picker');

const datePickerProps = {
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
        type: [String, Array] as PropType<string | string[]>,
        default: '请选择日期',
    },
    appendToContainer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function as PropType<GetContainer>,
    },
    format: String,
    popperClass: String,
    control: Boolean,
    shortcuts: Object,
    disabledDate: Function as PropType<(date: Date) => boolean>,
    ...COMMON_PROPS,
    ...RANGE_PROPS,
} as const;

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

export type DatePickerProps = Partial<ExtractPropTypes<typeof datePickerProps>>;

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

export default defineComponent({
    name: 'FDatePicker',
    components: {
        Calendars,
        WInput,
        Popper,
        DateOutlined,
        RangeInput,
        SwapRightOutlined,
    },
    props: datePickerProps,
    emits: [
        'update:modelValue',
        'update:open',
        'change',
        'clear',
        'blur',
        'focus',
    ],
    setup(props, { emit }) {
        useTheme();
        const [isOpened, updatePopperOpen] = useNormalModel(props, emit, {
            prop: 'open',
        });
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const isRange = computed(() => DATE_TYPE[props.type].isRange);
        const { validate } = useFormAdaptor(
            computed(() => (isRange.value ? 'array' : 'number')),
        );

        const { tmpSelectedDates, tmpSelectedDateChange } =
            useTmpSelectedDates();

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
});
</script>
