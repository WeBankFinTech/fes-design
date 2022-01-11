<template>
    <div :class="classes" @dragstart.prevent>
        <span
            :class="[
                `${prefixCls}-increase`,
                { 'is-disabled': maxDisabled || disabled },
            ]"
            @mousedown.prevent
            @click="calculationNum(ActionEnum.PLUS)"
        >
            <UpOutlined />
        </span>
        <span
            :class="[
                `${prefixCls}-decrease`,
                { 'is-disabled': minDisabled || disabled },
            ]"
            @mousedown.prevent
            @click="calculationNum(ActionEnum.REDUCE)"
        >
            <DownOutlined />
        </span>
        <FInput
            :modelValue="displayValue"
            :disabled="disabled"
            :placeholder="placeholder"
            :class="`${prefixCls}-inner`"
            @input="handleInput"
            @change="handleInputChange"
            @focus="(event: Event) => $emit('focus', event)"
            @blur="handleBlur"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { isNumber } from 'lodash-es';

import { UpOutlined, DownOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import FInput from '../input/input.vue';

const prefixCls = getPrefixCls('input-number');

enum ActionEnum {
    PLUS,
    REDUCE,
}

type InputNumberProps = {
    modelValue?: number;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    disabled?: boolean;
    placeholder?: string;
};

type InputNumberEmits = {
    (e: 'update:modelValue', value: number): void;
    (e: 'change', newValue: number, oldValue: number): void;
    (e: 'input', value: number): void;
    (e: 'blur', event: Event): void;
    (e: 'focus', event: Event): void;
};

const props = withDefaults(defineProps<InputNumberProps>(), {
    min: -Infinity,
    max: Infinity,
    step: 1,
    placeholder: '',
});

const emit = defineEmits<InputNumberEmits>();

useTheme();
const { validate } = useFormAdaptor('number');
const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

const classes = computed(() =>
    [`${prefixCls}`, props.disabled && 'is-disabled'].filter(Boolean),
);

const tempValue = ref();
const displayValue = computed(() => {
    if (tempValue.value != null) return tempValue.value;

    return currentValue.value;
});

// 获取输入值的小数位数
const getPrecison = (val: number) => {
    if (val == null) return 0;
    const valueString = val.toString();
    const dotPosition = valueString.indexOf('.');
    let valuePrecison = 0;
    if (dotPosition !== -1) {
        valuePrecison = valueString.length - dotPosition - 1;
    }
    return valuePrecison;
};

// 数字的实际精度 （组件绑定的精度属性要处理）
const numPresicion = computed(() => {
    const stepPrecision = getPrecison(props.step);
    if (props.precision != null) {
        const positiveIntegerPresicion = Math.abs(Math.round(props.precision));
        if (stepPrecision > positiveIntegerPresicion) {
            console.warn(
                '[InputNumber]precision should not be less than the decimal places of step',
            );
        }
        return positiveIntegerPresicion;
    }
    return Math.max(getPrecison(currentValue.value), stepPrecision); // 计算时可能currentvalue 无值
});

// 保留指定的小数位数
const toPrecision = (num: number, pre?: number): number => {
    if (pre == null) pre = numPresicion.value;
    return Math.round(num * 10 ** pre) / 10 ** pre;
};

const setCurrentValue = (newVal: number) => {
    const oldVal = currentValue.value;
    if (isNumber(newVal) && props.precision != null) {
        newVal = toPrecision(newVal, props.precision);
    }
    if (newVal != null && newVal >= props.max) newVal = props.max;
    if (newVal != null && newVal <= props.min) newVal = props.min;
    if (oldVal === newVal) return;

    tempValue.value = null;
    updateCurrentValue(newVal);
    emit('input', newVal);
    emit('change', newVal, oldVal);

    validate('input');
    validate('change');
};

const handleBlur = (e: Event) => {
    emit('blur', e);
    validate('blur');
};

const handleInput = (value: string) => {
    tempValue.value = value;
};
const handleInputChange = (value: string | number) => {
    const newVal = value === '' ? null : Number(value);
    if (!Number.isNaN(newVal) || value === '') {
        setCurrentValue(Number(newVal));
    }
    tempValue.value = null;
};

const _calculationNum = (val: number, type: ActionEnum) => {
    if (!isNumber(val) && val != null) return tempValue.value;
    const precisionFactor = 10 ** numPresicion.value;
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
    () => _calculationNum(currentValue.value, ActionEnum.REDUCE) < props.min,
);
// 是否已加到最大值
const maxDisabled = computed(
    () => _calculationNum(currentValue.value, ActionEnum.PLUS) > props.max,
);

const calculationNum = (type: ActionEnum) => {
    if (props.disabled || maxDisabled.value) return;
    if (tempValue.value) {
        handleInputChange(tempValue.value);
    }

    setCurrentValue(_calculationNum(currentValue.value, type));
};
</script>

<script lang="ts">
export default {
    name: 'FInputNumber',
};
</script>
