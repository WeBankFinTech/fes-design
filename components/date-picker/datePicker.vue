<template>
    <Popper
        v-model="isOpened"
        :disabled="disabled"
        :appendToContainer="appendToContainer"
        :getContainer="getContainer"
        :popperClass="[popperClass, `${prefixCls}-popper`]"
        trigger="click"
        :hideAfter="0"
        placement="bottom-start"
        :offset="4"
        onlyShowTrigger
        @update:modelValue="handlePopperVisible"
    >
        <template #trigger>
            <RangeInput
                v-if="pickerRef.isRange"
                ref="inputRangeRefEL"
                :format="pickerRef.format"
                :selectedDates="visibleValue"
                :placeholder="rangePlaceHolder"
                :clearable="clearable"
                :disabled="disabled"
                :innerIsFocus="inputIsFocus"
                :style="style"
                @focus="handleFocus"
                @blur="handleBlur"
                @clear="clear"
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
            <InputInner
                v-else
                ref="inputRefEl"
                :modelValue="dateText"
                :placeholder="singlePlaceHolder"
                :disabled="disabled"
                :clearable="clearable"
                :innerIsFocus="inputIsFocus"
                :style="style"
                @focus="handleFocus"
                @input="handleDateInput"
                @blur="handleDateInputBlur"
                @clear="clear"
            >
                <template #suffix>
                    <slot v-if="$slots.suffixIcon" name="suffixIcon"></slot>
                    <DateOutlined v-else />
                </template>
            </InputInner>
        </template>
        <template #default>
            <calendars
                ref="calendarsRef"
                :visible="isOpened"
                :modelValue="currentValue"
                :type="type"
                :control="control"
                :shortcuts="shortcuts"
                :minDate="minDate"
                :maxDate="maxDate"
                :maxRange="maxRange"
                :hourStep="hourStep"
                :minuteStep="minuteStep"
                :secondStep="secondStep"
                :disabledDate="disabledDate"
                :disabledTime="disabledTime"
                @change="change"
                @tmpSelectedDateChange="tmpSelectedDateChange"
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
    ComponentPublicInstance,
    provide,
    CSSProperties,
} from 'vue';
import RangeInput from './rangeInput.vue';
import Calendars from './calendars.vue';
import InputInner from '../input/inputInner.vue';
import Popper from '../popper';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { useNormalModel } from '../_util/use/useModel';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { DateOutlined, SwapRightOutlined } from '../icon';

import { isEmptyValue, timeFormat, getTimestampFromFormat } from './helper';
import { COMMON_PROPS, RANGE_PROPS } from './const';

import type { GetContainer } from '../_util/interface';
import { useLocale } from '../config-provider/useLocale';
import { FORM_ITEM_INJECTION_KEY } from '../_util/constants';
import { noop } from '../_util/utils';
import { pickerFactory, Picker } from './pickerHander';

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
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties>,
    },
    popperClass: [String, Array, Object] as PropType<string | [] | object>,
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

const useInput = ({
    visibleValue,
    picker,
    updateCurrentValue,
}: {
    visibleValue: Ref<number>;
    picker: ComputedRef<Picker>;
    updateCurrentValue: (val: any) => void;
}) => {
    const dateText = ref<string>();
    let cacheValidInputDate = '';

    const getFormatDate = () => {
        if (isEmptyValue(visibleValue.value)) {
            return '';
        }
        if (!picker.value.isRange) {
            return timeFormat(visibleValue.value, picker.value.format);
        }
        return '';
    };
    const resetDateText = () => {
        dateText.value = getFormatDate();
        cacheValidInputDate = dateText.value;
    };
    watch(visibleValue, resetDateText, {
        immediate: true,
    });

    const handleDateInput = (val: string) => {
        dateText.value = val;
        if (picker.value.isEffectiveDate(val)) {
            cacheValidInputDate = val;
            updateCurrentValue(
                getTimestampFromFormat(
                    picker.value.getDateFromStr(val),
                    picker.value.format,
                ),
            );
        }
    };
    const handleDateInputBlur = () => {
        if (dateText.value !== cacheValidInputDate && cacheValidInputDate) {
            dateText.value = cacheValidInputDate;
        }
    };

    return {
        resetDateText,
        dateText,
        handleDateInput,
        handleDateInputBlur,
    };
};

const usePlaceholder = (
    props: DatePickerProps,
    picker: ComputedRef<Picker>,
) => {
    const { t } = useLocale();

    const rangePlaceHolder = computed(() => {
        if (props.placeholder) return props.placeholder;
        const placeholderLang = picker.value.placeholderLang;
        if (Array.isArray(placeholderLang)) {
            return placeholderLang.map((item) => t(item));
        }
        return t(placeholderLang);
    });

    const singlePlaceHolder = computed(() => {
        if (props.placeholder) return props.placeholder as string;
        return t(picker.value.placeholderLang as string);
    });

    return {
        rangePlaceHolder,
        singlePlaceHolder,
    };
};

export default defineComponent({
    name: 'FDatePicker',
    components: {
        Calendars,
        InputInner,
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
        const pickerRef = computed(() => {
            return pickerFactory(props.type);
        });
        const inputRefEl = ref<HTMLElement>();
        const inputRangeRefEL = ref<HTMLElement>();
        const calendarsRef = ref<ComponentPublicInstance>();
        const activeInputRefEL = computed(() => {
            if (pickerRef.value.isRange) {
                return inputRangeRefEL.value;
            }
            return inputRefEl.value;
        });

        const { validate, isError } = useFormAdaptor(
            computed(() => (pickerRef.value.isRange ? 'array' : 'number')),
        );
        // 避免子组件重复
        provide(FORM_ITEM_INJECTION_KEY, { validate: noop, isError });

        const { rangePlaceHolder, singlePlaceHolder } = usePlaceholder(
            props,
            pickerRef,
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

        const {
            resetDateText,
            dateText,
            handleDateInput,
            handleDateInputBlur,
        } = useInput({
            visibleValue,
            updateCurrentValue,
            picker: pickerRef,
        });

        const handleChange = (val: number | number[] | null) => {
            if (val !== currentValue.value) {
                updateCurrentValue(val);
                emit('change', val);
                validate('change');
            }
        };
        // 事件
        const clear = () => {
            const initValue: [] | null = pickerRef.value.isRange ? [] : null;
            tmpSelectedDateChange(initValue);
            handleChange(initValue);
            emit('clear');
        };

        const change = (val: number | number[] | null) => {
            handleChange(val);

            // 选择完后重新聚焦
            // TODO 如果有取消按钮，取消之后也应该重新聚焦
            activeInputRefEL.value.focus();
            updatePopperOpen(false);
        };

        const inputIsFocus = ref(false);
        const handleFocus = (e: Event) => {
            // 防止重复聚焦
            if (!inputIsFocus.value) {
                inputIsFocus.value = true;
                emit('focus', e);
            }
        };
        let cacheEvent: Event = null;
        const checkBlur = () => {
            if (!isOpened.value && cacheEvent) {
                emit('blur', cacheEvent);
                validate('blur');
                // 重置输入框内容
                resetDateText();
                cacheEvent = null;
                inputIsFocus.value = false;
            }
        };
        const handleBlur = (e: FocusEvent) => {
            cacheEvent = e;
            // 非弹窗内容点击导致的失焦，进行 blur 的校验
            if (!calendarsRef.value.$el.contains(e.relatedTarget)) {
                isOpened.value && updatePopperOpen(false);
                checkBlur();
            }
        };

        watch(isOpened, () => {
            if (!isOpened.value) {
                // 重置临时输入
                tmpSelectedDateChange(null);
            }
        });

        const handlePopperVisible = (val: boolean) => {
            if (val === false) {
                checkBlur();
            }
        };

        return {
            prefixCls,
            isOpened,
            currentValue,
            visibleValue,

            dateText,
            handleDateInput,
            handleDateInputBlur: (event: FocusEvent) => {
                handleDateInputBlur();
                handleBlur(event);
            },
            pickerRef,

            clear,
            change,
            inputIsFocus,
            handleFocus,
            handleBlur,

            tmpSelectedDateChange,
            rangePlaceHolder,
            singlePlaceHolder,

            handlePopperVisible,

            inputRefEl,
            inputRangeRefEL,
            calendarsRef,
        };
    },
});
</script>
