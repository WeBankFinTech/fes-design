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
                    ref="timeSelectRef"
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
                <div v-if="showControl || $slots.addon" :class="`${prefixCls}-addon`">
                    <slot name="addon" :activeTime="activeTime">
                        <div :class="`${prefixCls}-addon-inner`">
                            <FButton
                                v-if="showNowShortcut"
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
import {
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    ref,
    watch,
} from 'vue';
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
import type { ExtractPublicPropTypes, GetContainer } from '../_util/interface';
import TimeSelect from './time-select.vue';

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
    if (!val) {
        return false;
    }
    if (
        val.length > 3
        || !/^\d{1,2}$/.test(val)
        || Number(val) > max
        || val.length < cellFormat.length
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
            if (!validator(times.shift(), cellFormat, 23)) {
                return false;
            }
        } else {
            if (!validator(times.shift(), cellFormat, 59)) {
                return false;
            }
        }
    }
    return true;
}

export const timePickerProps = {
    modelValue: {
        // timePicker 目前仅支持string
        type: String,
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
} as const satisfies ComponentObjectPropsOptions;

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
    setup(props, { emit, attrs }) {
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

        const showControl = computed(() => props.control);

        const showNowShortcut = computed(() => {
            // format 中的 token 需要与 TimeSelect 中的 canSelectHours 保持一致
            if (props.format.includes('H') && props.hourStep !== 1) {
                return false;
            }
            if (props.format.includes('m') && props.minuteStep !== 1) {
                return false;
            }
            if (props.format.includes('s') && props.secondStep !== 1) {
                return false;
            }
            return true;
        });

        // 临时的值
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
        // 获取 实例
        const timeSelectRef = ref();

        // 解耦 与设置值的方法分开
        const clear = () => {
            tempValue.value = '';
            updateCurrentValue('');
            activeTime.value = '';
            emit('change', '');
            validate('change');
            // 重置时间
            timeSelectRef.value.resetTime();
        };

        watch(isOpened, () => {
            // 关闭将选中的数据赋值，因此确认按钮只用关闭弹窗即可
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

        // 输入框展示的值
        const displayValue = computed(() => {
            // 目前没有范围选择
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
            showNowShortcut,
            setCurrentTime,
            confirmChangeTime,
            activeTime,
            inputPlaceholder,
            t,
            attrs,
            timeSelectRef,
        };
    },
});
</script>
