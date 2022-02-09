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
                :placeholder="rangePlaceholder"
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
                :placeholder="inputPlaceholder"
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
    ComputedRef,
    provide,
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
import { useLocale } from '../config-provider/useLocale';
import { isArray } from 'lodash-es';
import { FORM_ITEM_INJECTION_KEY } from '../_util/constants';
import { noop } from '../_util/utils';

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

const usePlaceholder = (
    props: DatePickerProps,
    isRange: ComputedRef<boolean>,
) => {
    const { t } = useLocale();
    const rangePlaceholder = computed(() => {
        let placeholder: string[] = [];
        if (!isRange.value) {
            return placeholder;
        }
        if (props.placeholder) {
            return isArray(props.placeholder)
                ? props.placeholder
                : [props.placeholder, props.placeholder];
        }

        switch (props.type) {
            case DATE_TYPE.daterange.name:
                placeholder = [
                    t('datePicker.selectStartDate'),
                    t('datePicker.selectEndDate'),
                ];
                break;
            case DATE_TYPE.datetimerange.name:
                placeholder = [
                    t('datePicker.selectStartDateTime'),
                    t('datePicker.selectEndDateTime'),
                ];
                break;
            default:
                placeholder = [t('datePicker.select'), t('datePicker.select')];
                break;
        }
        return placeholder;
    });

    const inputPlaceholder = computed(() => {
        let placeholder = '';
        if (isRange.value) {
            return placeholder;
        }
        if (props.placeholder) {
            return props.placeholder as string;
        }
        switch (props.type) {
            case DATE_TYPE.year.name:
                placeholder = t('datePicker.selectYear');
                break;
            case DATE_TYPE.month.name:
                placeholder = t('datePicker.selectMonth');
                break;
            case DATE_TYPE.quarter.name:
                placeholder = t('datePicker.selectQuarter');
                break;
            case DATE_TYPE.date.name:
                placeholder = t('datePicker.selectDate');
                break;
            case DATE_TYPE.datetime.name:
                placeholder = t('datePicker.selectDateTime');
                break;
            default:
                placeholder = t('datePicker.select');
                break;
        }
        return placeholder;
    });

    return {
        inputPlaceholder,
        rangePlaceholder,
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
        const { validate, isError } = useFormAdaptor(
            computed(() => (isRange.value ? 'array' : 'number')),
        );
        // 避免子组件重复
        provide(FORM_ITEM_INJECTION_KEY, { validate: noop, isError });

        const { inputPlaceholder, rangePlaceholder } = usePlaceholder(
            props,
            isRange,
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
            if (val !== currentValue.value) {
                emit('change', val);
                validate('change');
            }
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
            handleChange(val);
            updateCurrentValue(val);
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
            inputPlaceholder,
            rangePlaceholder,
        };
    },
});
</script>
