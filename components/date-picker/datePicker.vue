<template>
    <Popper
        v-model="isOpened"
        :disabled="innerDisabled"
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
                :format="format || pickerRef.format"
                :selectedDates="visibleValue"
                :placeholder="innerPlaceHolder"
                :clearable="clearable"
                :disabled="innerDisabled"
                :innerIsFocus="inputIsFocus"
                :innerIsError="isError"
                :class="attrs.class"
                :style="attrs.style"
                :changeSelectedDates="changeDateByInput"
                :maxRange="maxRange"
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
                :disabled="innerDisabled"
                :canEdit="pickerRef.name !== PickerType.datemultiple"
                :clearable="clearable"
                :innerIsFocus="inputIsFocus"
                :innerIsError="isError"
                :class="attrs.class"
                :style="attrs.style"
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
                :defaultTime="defaultTime"
                @change="changeDateBycalendars"
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
    ComputedRef,
    ComponentPublicInstance,
} from 'vue';
import { format, isValid } from 'date-fns';
import { isEqual, isNil, isArray } from 'lodash-es';
import InputInner from '../input/inputInner.vue';
import Popper from '../popper';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { useNormalModel } from '../_util/use/useModel';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { DateOutlined, SwapRightOutlined } from '../icon';

import { useLocale } from '../config-provider/useLocale';
import { COMMON_PROPS, RANGE_PROPS } from './const';
import { isEmptyValue, strictParse } from './helper';
import Calendars from './calendars.vue';
import RangeInput from './rangeInput.vue';
import { pickerFactory, PickerType } from './pickerHandler';
import { useDisable } from './use';
import type { GetContainer } from '../_util/interface';
import type { Picker } from './pickerHandler';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('date-picker');

export const datePickerProps = {
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

export type DatePickerProps = ExtractPublicPropTypes<typeof datePickerProps>;

const useInput = ({
    props,
    visibleValue,
    picker,
    changeDateByInput,
}: {
    props: DatePickerProps;
    visibleValue: Ref<number>;
    picker: ComputedRef<Picker>;
    changeDateByInput: (val: any) => void;
}) => {
    const dateText = ref<string>();
    const { innerDisabledDate } = useDisable(props);
    let cacheValidInputDate = '';

    const getFormatDate = () => {
        if (isEmptyValue(visibleValue.value)) {
            return '';
        }
        if (!picker.value.isRange) {
            if (isArray(visibleValue.value)) {
                return visibleValue.value
                    .map((item) => {
                        return format(
                            item,
                            props.format || picker.value.format,
                        );
                    })
                    .join('; ');
            }
            return format(
                visibleValue.value,
                props.format || picker.value.format,
            );
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
        const date = strictParse(
            val,
            props.format || picker.value.format,
            new Date(),
        );
        if (
            isValid(date) &&
            !innerDisabledDate(date, props.format || picker.value.format)
        ) {
            cacheValidInputDate = val;
            changeDateByInput(date.getTime());
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

    const innerPlaceHolder = computed(() => {
        if (props.placeholder) return props.placeholder;
        const placeholderLang = picker.value.placeholderLang;
        if (Array.isArray(placeholderLang)) {
            return placeholderLang.map((item) => t(item));
        }
        return t(placeholderLang);
    });

    const singlePlaceHolder = computed(() => {
        return Array.isArray(innerPlaceHolder.value)
            ? innerPlaceHolder.value[0]
            : innerPlaceHolder.value;
    });

    return {
        innerPlaceHolder,
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
    setup(props, { emit, attrs }) {
        useTheme();
        const [isOpened, updatePopperOpen] = useNormalModel(props, emit, {
            prop: 'open',
        });
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
        /**
         * props.format 是最终给用户展示的格式，不必和 picker.value.format 一致
         * picker.value.format 用于内部处理
         */
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

        const { validate, isError, isFormDisabled } = useFormAdaptor({
            valueType: computed(() =>
                pickerRef.value.isRange ? 'array' : 'number',
            ),
            forbidChildValidate: true,
        });

        const innerDisabled = computed(
            () => props.disabled || isFormDisabled.value,
        );

        const { innerPlaceHolder, singlePlaceHolder } = usePlaceholder(
            props,
            pickerRef,
        );

        const { tmpSelectedDates, tmpSelectedDateChange } =
            useTmpSelectedDates();

        const visibleValue = computed(() => {
            if (isOpened.value) {
                return isNil(tmpSelectedDates.value)
                    ? currentValue.value
                    : tmpSelectedDates.value;
            }
            return currentValue.value;
        });

        const handleChange = (val: number | number[] | null) => {
            if (!isEqual(val, currentValue.value)) {
                updateCurrentValue(val);
                emit('change', val);
                validate('change');
            }
        };

        // 输入框里的变更，直接更新 currentValue
        const changeDateByInput = (val: number | number[]) => {
            tmpSelectedDateChange(null);
            handleChange(val);
        };

        const {
            resetDateText,
            dateText,
            handleDateInput,
            handleDateInputBlur,
        } = useInput({
            props,
            visibleValue,
            changeDateByInput,
            picker: pickerRef,
        });

        // 事件
        const clear = () => {
            const initValue: [] | null =
                pickerRef.value.isRange ||
                pickerRef.value.name === PickerType.datemultiple
                    ? []
                    : null;
            tmpSelectedDateChange(null);
            handleChange(initValue);
            emit('clear');
        };

        const changeDateBycalendars = (val: number | number[] | null) => {
            handleChange(val);
            // 选择完后重新聚焦
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
            // 兼容禁用状态，选择框不展示的情况
            if (!calendarsRef.value?.$el.contains(e.relatedTarget)) {
                if (isOpened.value) {
                    updatePopperOpen(false);
                }
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

            isError,
            innerDisabled,
            dateText,
            handleDateInput,
            handleDateInputBlur: (event: FocusEvent) => {
                handleDateInputBlur();
                handleBlur(event);
            },
            PickerType,
            pickerRef,

            changeDateByInput,

            clear,
            changeDateBycalendars,
            inputIsFocus,
            handleFocus,
            handleBlur,

            tmpSelectedDateChange,
            innerPlaceHolder,
            singlePlaceHolder,

            handlePopperVisible,

            inputRefEl,
            inputRangeRefEL,
            calendarsRef,

            attrs,
        };
    },
});
</script>
