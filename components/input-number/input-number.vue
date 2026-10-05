<template>
    <div :class="classes" @dragstart.prevent>
        <InputInner
            ref="inputRef"
            :modelValue="displayValue"
            :disabled="innerDisabled"
            :readonly="readonly"
            :placeholder="placeholder"
            :class="[`${prefixCls}-inner`]"
            :innerIsError="isError"
            @input="handleInput"
            @focus="onFocused"
            @blur="handleBlur"
            @keydown="handleKeydown"
            @wheel="handleWheel"
        >
            <template v-if="$slots.prefix" #prefix>
                <slot name="prefix" />
            </template>
            <template #suffix>
                <slot name="suffix" />
                <div
                    v-if="showStepAction"
                    :class="[
                        `${prefixCls}-actions`,
                        $slots.suffix && `${prefixCls}-actions-suffix`,
                    ]"
                >
                    <span
                        :class="[
                            `${prefixCls}-actions-increase`,
                            {
                                'is-disabled': maxDisabled || innerDisabled,
                            },
                        ]"
                        @mousedown.prevent
                        @click="calculationNum(ActionEnum.PLUS)"
                    >
                        <UpOutlined />
                    </span>
                    <span
                        :class="[
                            `${prefixCls}-actions-decrease`,
                            {
                                'is-disabled': minDisabled || innerDisabled,
                            },
                        ]"
                        @mousedown.prevent
                        @click="calculationNum(ActionEnum.REDUCE)"
                    >
                        <DownOutlined />
                    </span>
                </div>
            </template>
        </InputInner>
    </div>
</template>

<script lang="ts">
import {
    type ComponentObjectPropsOptions,
    computed,
    defineComponent,
    nextTick,
    onMounted,
    ref,
} from 'vue';
import { isNumber } from 'lodash-es';
import { DownOutlined, UpOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import InputInner from '../input/inputInner.vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('input-number');

enum ActionEnum {
    PLUS,
    REDUCE,
}

export const inputNumberProps = {
    modelValue: Number,
    min: {
        type: Number,
        default: Number.NEGATIVE_INFINITY,
    },
    max: {
        type: Number,
        default: Number.POSITIVE_INFINITY,
    },
    step: {
        type: Number,
        default: 1,
    },
    showStepAction: {
        type: Boolean,
        default: true,
    },
    precision: Number,
    disabled: Boolean,
    placeholder: String,
    autofocus: {
        type: Boolean,
        default: false,
    },
    readonly: Boolean,
    // 键盘上下方向键步进（#1039）
    keyboard: {
        type: Boolean,
        default: true,
    },
    // 聚焦时滚轮步进（#1039）
    wheel: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;

export type InputNumberProps = ExtractPublicPropTypes<typeof inputNumberProps>;

export default defineComponent({
    name: 'FInputNumber',
    components: {
        InputInner,
        UpOutlined,
        DownOutlined,
    },
    props: inputNumberProps,
    emits: ['update:modelValue', 'change', 'input', 'blur', 'focus'],
    setup(props, { emit }) {
        useTheme();
        const { validate, isError, isFormDisabled } = useFormAdaptor({
            valueType: 'number',
            forbidChildValidate: true,
        });

        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const innerDisabled = computed(
            () => props.disabled || isFormDisabled.value,
        );

        const classes = computed(() =>
            [`${prefixCls}`, innerDisabled.value && 'is-disabled'].filter(
                Boolean,
            ),
        );

        const inputRef = ref();
        const tempValue = ref();
        const displayValue = computed(() => {
            if (tempValue.value != null) {
                return tempValue.value;
            }
            return currentValue.value;
        });

        // 获取输入值的小数位数
        const getPrecision = (val: number) => {
            if (val == null) {
                return 0;
            }
            const valueString = val.toString();
            const dotPosition = valueString.indexOf('.');
            let valuePrecision = 0;
            if (dotPosition !== -1) {
                valuePrecision = valueString.length - dotPosition - 1;
            }
            return valuePrecision;
        };

        // 数字的实际精度 （组件绑定的精度属性要处理）
        const numPrecision = computed(() => {
            const stepPrecision = getPrecision(props.step);
            if (props.precision != null) {
                const positiveIntegerPrecision = Math.abs(
                    Math.round(props.precision),
                );
                if (stepPrecision > positiveIntegerPrecision) {
                    console.warn(
                        '[InputNumber]precision should not be less than the decimal places of step',
                    );
                }
                return positiveIntegerPrecision;
            }
            return Math.max(getPrecision(currentValue.value), stepPrecision); // 计算时可能currentvalue 无值
        });

        // 保留指定的小数位数
        const toPrecision = (num: number, pre?: number): number => {
            if (pre == null) {
                pre = numPrecision.value;
            }
            return Math.round(num * 10 ** pre) / 10 ** pre;
        };

        const setCurrentValue = (newVal: number) => {
            const oldVal = currentValue.value;
            if (isNumber(newVal) && props.precision != null) {
                newVal = toPrecision(newVal, props.precision);
            }
            if (newVal != null && newVal >= props.max) {
                newVal = props.max;
            }
            if (oldVal === newVal) {
                return;
            }

            tempValue.value = null;
            updateCurrentValue(newVal);
            emit('input', newVal);
            emit('change', newVal, oldVal);
            validate('input');
            validate('change');
        };

        const handleBlur = (e: Event) => {
            if (tempValue.value) {
                tempValue.value = null;
            }
            // 避免输入的值小于最小值而导致无法继续输入的情况, 失焦的时候再处理
            if (currentValue.value != null && currentValue.value <= props.min) {
                currentValue.value = props.min;
            }
            emit('blur', e);
            validate('blur');
        };

        const handleInput = (value: string) => {
            tempValue.value = value;

            // 在下一个 tick 处理 tempValue，避免无法重制 displayValue
            nextTick(() => {
                if (
                    !value.endsWith('.')
                    && (!Number.isNaN(Number(value)) || value === '')
                ) {
                    setCurrentValue(value === '' ? null : Number(value));
                }
            });
        };
        const onFocused = (e: Event) => {
            emit('focus', e);
        };

        const _calculationNum = (val: number, type: ActionEnum) => {
            if (!isNumber(val) && val != null) {
                return tempValue.value;
            }
            const precisionFactor = 10 ** numPrecision.value;
            let tmp;
            if (type === ActionEnum.PLUS) {
                tmp = precisionFactor * val + precisionFactor * props.step;
            } else {
                tmp = precisionFactor * val - precisionFactor * props.step;
            }
            return toPrecision(tmp / precisionFactor);
        };
        // 是否已减小到最小值
        const minDisabled = computed(
            () =>
                _calculationNum(currentValue.value, ActionEnum.REDUCE)
                < props.min,
        );
        // 是否已加到最大值
        const maxDisabled = computed(
            () =>
                _calculationNum(currentValue.value, ActionEnum.PLUS)
                > props.max,
        );

        // 步进核心：#1039 键盘/滚轮与加减按钮共用。
        // 读当前 modelValue，按 numPrecision 计算 next（复用 _calculationNum），
        // 越界钳制到 min/max 并回传边界值；disabled/readonly 早退
        const step = (dir: 1 | -1) => {
            if (props.disabled || isFormDisabled.value || props.readonly) {
                return;
            }
            tempValue.value = null;
            const current = currentValue.value || 0;
            const currentNum = Number(currentValue.value ?? 0);
            const next = _calculationNum(
                current,
                dir === 1 ? ActionEnum.PLUS : ActionEnum.REDUCE,
            );
            if (props.min != null && next < props.min) {
                updateCurrentValue(props.min);
                emit('change', props.min, currentNum);
                return;
            }
            if (props.max != null && next > props.max) {
                updateCurrentValue(props.max);
                emit('change', props.max, currentNum);
                return;
            }
            setCurrentValue(next);
        };

        const calculationNum = (type: ActionEnum) => {
            if (
                props.disabled
                || (maxDisabled.value && type === ActionEnum.PLUS)
                || (minDisabled.value && type === ActionEnum.REDUCE)
                || isFormDisabled.value
            ) {
                return;
            }
            step(type === ActionEnum.PLUS ? 1 : -1);
        };

        // 键盘 ↑/↓ 步进（可经 keyboard=false 关闭）
        const handleKeydown = (e: KeyboardEvent) => {
            if (!props.keyboard) {
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                step(1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                step(-1);
            }
        };

        // 滚轮步进：仅当事件目标即当前聚焦元素时劫持（非聚焦放行滚页面）
        const handleWheel = (e: WheelEvent) => {
            if (!props.wheel) {
                return;
            }
            if (document.activeElement !== e.target) {
                return;
            }
            e.preventDefault();
            step(e.deltaY < 0 ? 1 : -1);
        };

        const focus = () => {
            inputRef.value.focus();
        };
        onMounted(() => {
            if (props.autofocus) {
                focus();
            }
        });

        return {
            prefixCls,
            isError,
            ActionEnum,
            innerDisabled,
            classes,
            handleInput,
            onFocused,

            handleBlur,
            calculationNum,
            step,
            handleKeydown,
            handleWheel,
            displayValue,
            minDisabled,
            maxDisabled,
            inputRef,
        };
    },
});
</script>
