<template>
    <Popper
        v-model="isOpened"
        trigger="click"
        placement="bottom-start"
        :popperClass="`${prefixCls}-popper`"
        :disabled="innerDisabled"
        :appendToContainer="appendToContainer"
        :getContainer="getContainer"
        :hideAfter="0"
        :offset="4"
        onlyShowTrigger
    >
        <template #trigger>
            <InputInner
                v-if="!isRange"
                :class="[attrs.class, classes]"
                :style="attrs.style"
                :modelValue="displayValue"
                :placeholder="inputPlaceholder"
                :disabled="innerDisabled"
                :clearable="clearable"
                :innerIsError="isError"
                @clear="clear"
                @input="handleInput"
                @focus="(event) => $emit('focus', event)"
                @blur="handleBlur"
            >
                <template v-if="showSuffix" #suffix>
                    <ClockCircleOutlined />
                </template>
            </InputInner>
        </template>
        <template #default>
            <div :class="`${prefixCls}-dropdown`" @mousedown.prevent>
                <TimeSelect
                    :visible="isOpened"
                    :modelValue="currentValue"
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
                            <FButton
                                type="link"
                                size="small"
                                @mousedown.prevent
                                @click="setCurrentTime"
                            >
                                {{ t('timePicker.now') }}
                            </FButton>
                            <FButton
                                type="primary"
                                size="small"
                                @mousedown.prevent
                                @click="confirmChangeTime"
                            >
                                {{ t('timePicker.confirm') }}
                            </FButton>
                        </div>
                    </slot>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, PropType } from 'vue';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import InputInner from '../input/inputInner.vue';
import { ClockCircleOutlined } from '../icon';
import Popper from '../popper';
import FButton from '../button';

import { useLocale } from '../config-provider/useLocale';
import TimeSelect from './time-select.vue';
import type { GetContainer } from '../_util/interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('time-picker');

// TODO 支持 12 小时制
function formatTimeCell(data: number) {
    return `${data}`.padStart(2, '0');
}

const getCurrentTime = (format: string) => {
    const date = new Date();
    return [
        format.indexOf('H') !== -1 && formatTimeCell(date.getHours()),
        format.indexOf('m') !== -1 && formatTimeCell(date.getMinutes()),
        format.indexOf('s') !== -1 && formatTimeCell(date.getSeconds()),
    ]
        .filter(Boolean)
        .join(':');
};

function validator(val: string | undefined, cellFormat: string, max: number) {
    if (!val) return false;
    if (
        val.length > 3 ||
        !/^\d{1,2}$/.test(val) ||
        Number(val) > max ||
        val.length < cellFormat.length
    ) {
        return false;
    }
    return true;
}

function validateTime(data: string, format: string) {
    const times = data.split(':');
    const cellFormats = format.split(':');
    if (times.length !== cellFormats.length) {
        return false;
    }

    for (let i = 0; i < cellFormats.length; ++i) {
        const cellFormat = cellFormats[i];
        if (/[Hh]/.test(cellFormat)) {
            if (!validator(times.shift(), cellFormat, 23)) return false;
        } else {
            if (!validator(times.shift(), cellFormat, 59)) return false;
        }
    }
    return true;
}

export const timePickerProps = {
    modelValue: {
        type: [String, Array] as PropType<string | string[] | number[]>,
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
        type: Function as PropType<GetContainer>,
    },
    placeholder: {
        type: String,
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
    disabledHours: Function as PropType<(h: number) => boolean>,
    disabledMinutes: Function as PropType<(h: number, m: number) => boolean>,
    disabledSeconds: Function as PropType<
        (h: number, m: number, s: number) => boolean
    >,
    control: {
        type: Boolean,
        default: true,
    },
    showSuffix: {
        type: Boolean,
        default: true,
    },
    inputClass: {
        type: [String, Object, Array] as PropType<string | object | []>,
    },
} as const;

export type TimePickerProps = ExtractPublicPropTypes<typeof timePickerProps>;

function useOpen(props: TimePickerProps, emit: any) {
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

export default defineComponent({
    name: 'FTimePicker',
    components: {
        TimeSelect,
        InputInner,
        Popper,
        ClockCircleOutlined,
        FButton,
    },
    props: timePickerProps,
    emits: [UPDATE_MODEL_EVENT, 'update:open', 'change', 'blur', 'focus'],
    setup(props, { emit, slots, attrs }) {
        useTheme();
        const { validate, isError, isFormDisabled } = useFormAdaptor({
            forbidChildValidate: true,
        });

        const innerDisabled = computed(
            () => props.disabled || isFormDisabled.value,
        );
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
        const { isOpened, closePopper } = useOpen(props, emit);
        const classes = computed(() =>
            [
                prefixCls,
                (isFormDisabled.value || props.disabled) && 'is-disabled',
                props.inputClass,
            ].filter(Boolean),
        );

        const showControl = computed(() => props.control || slots.addon);

        const tempValue = ref();

        const { t } = useLocale();
        const inputPlaceholder = computed(
            () => props.placeholder || t('timePicker.placeholder'),
        );

        const activeTime = ref();
        const changeTime = (val: string) => {
            tempValue.value = '';
            activeTime.value = val;
        };

        const setCurrentValue = (val: string) => {
            if (val !== currentValue.value) {
                tempValue.value = '';
                updateCurrentValue(val);
                emit('change', val);
                validate('change');
                activeTime.value = val;
            }
        };
        const clear = () => {
            setCurrentValue('');
        };

        watch(isOpened, () => {
            if (!isOpened.value && activeTime.value) {
                setCurrentValue(activeTime.value);
            }
        });

        const handleInput = (val: string) => {
            tempValue.value = val;
            if (validateTime(val, props.format)) {
                setCurrentValue(val);
            }
        };

        const setCurrentTime = () => {
            setCurrentValue(getCurrentTime(props.format));
            closePopper();
        };
        const confirmChangeTime = () => {
            closePopper();
        };

        const displayValue = computed(() => {
            if (props.isRange) {
                return currentValue.value || [];
            }
            return (
                tempValue.value || activeTime.value || currentValue.value || ''
            );
        });

        const handleBlur = (event: Event) => {
            closePopper();
            emit('blur', event);
            validate('blur');

            // 重置手动输入值
            tempValue.value = null;
        };

        return {
            prefixCls,
            isError,
            innerDisabled,
            classes,
            displayValue,
            isOpened,
            currentValue,

            tempValue,

            handleInput,
            handleBlur,
            clear,
            changeTime,
            showControl,
            setCurrentTime,
            confirmChangeTime,

            activeTime,
            inputPlaceholder,
            t,

            attrs,
        };
    },
});
</script>
