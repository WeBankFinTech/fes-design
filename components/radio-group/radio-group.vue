<template>
    <div :class="classList">
        <slot />
        <Radio
            v-for="opt in optionsRef"
            :key="(opt.value as any)"
            :value="opt.value"
            :label="opt.label"
            :disabled="opt.disabled"
        ></Radio>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { Option } from '../_util/interface';
import Radio from '../radio/radio.vue';
import { useRadioGroup } from './useRadioGroup';

export type RadioGroupProps = {
    modelValue?: string | number | boolean;
    vertical?: boolean;
    disabled?: boolean;
    cancelable?: boolean;
    options?: Array<Option>;
    valueField?: string;
    labelField?: string;
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
});

const emit = defineEmits<RadioGroupEmits>();

useTheme();
useRadioGroup(props, emit);
const classList = computed(() => [
    prefixCls,
    props.vertical && 'is-vertical',
    props.disabled && 'is-disabled',
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
import { name } from './const';

export default {
    name,
};
</script>
