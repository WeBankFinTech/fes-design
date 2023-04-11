<template>
    <div :class="classList">
        <slot />
        <template v-if="props.optionType === 'default'">
            <Radio
                v-for="opt in optionsRef"
                :key="(opt.value as any)"
                :value="opt.value"
                :label="opt.label"
                :disabled="opt.disabled || isFormDisabled"
            ></Radio>
        </template>
        <template v-else>
            <RadioButton
                v-for="opt in optionsRef"
                :key="(opt.value as any)"
                :value="opt.value"
                :label="opt.label"
                :disabled="opt.disabled || isFormDisabled"
            ></RadioButton>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import Radio from '../radio';
import RadioButton from '../radio-button';
import { useRadioGroup } from './useRadioGroup';
import { name } from './const';
import type { Size, Type, OptionType } from './interface';

export type RadioGroupProps = {
    modelValue?: string | number | boolean;
    vertical?: boolean;
    disabled?: boolean;
    cancelable?: boolean;
    options?: Array<Option>;
    valueField?: string;
    labelField?: string;
    size?: Size;
    type?: Type;
    bordered?: boolean;
    optionType?: OptionType;
};

export type RadioGroupEmits = {
    (e: 'update:modelValue', value: string | number | boolean): void;
    (e: 'change', value: string | number | boolean): void;
};

const prefixCls = getPrefixCls('radio-group');

const props = withDefaults(defineProps<RadioGroupProps>(), {
    vertical: false,
    disabled: false,
    cancelable: true,
    options: () => [],
    valueField: 'value',
    labelField: 'label',
    size: 'middle' as Size,
    type: 'default' as Type,
    bordered: true,
    optionType: 'default' as OptionType,
});

const emit = defineEmits<RadioGroupEmits>();

useTheme();
const { isFormDisabled } = useRadioGroup(props, emit);
const classList = computed(() => [
    prefixCls,
    props.vertical && 'is-vertical',
    (props.disabled || isFormDisabled.value) && 'is-disabled',
]);

const optionsRef = computed(() =>
    props.options.map((opt: any) => {
        return {
            ...opt,
            value: opt[props.valueField],
            label: opt[props.labelField],
        };
    }),
);
</script>

<script lang="ts">
import type { Option } from '../_util/interface';

export default {
    name,
};
</script>
