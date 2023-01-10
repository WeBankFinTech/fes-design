<template>
    <div :class="classList">
        <slot />
        <Checkbox
            v-for="opt in optionsRef"
            :key="(opt.value as any)"
            :value="opt.value"
            :label="opt.label"
            :disabled="opt.disabled"
        ></Checkbox>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import Checkbox from '../checkbox/checkbox.vue';
import { Option } from '../_util/interface';
import { useCheckboxGroup } from './useCheckboxGroup';

// 由于 vue setup 的限制，声明文件必须放在同一个文件中
// https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md#type-only-propsemit-declarations
export type CheckboxGroupProps = {
    modelValue?: [];
    vertical?: boolean;
    disabled?: boolean;
    options?: Array<Option>;
    valueField?: string;
    labelField?: string;
};

export type CheckboxGroupEmits = {
    (e: 'update:modelValue', value: string | number | boolean): void;
    (e: 'change', value: string | number | boolean): void;
};

const prefixCls = getPrefixCls('checkbox-group');

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
    modelValue: () => [],
    vertical: false,
    disabled: false,
    options: () => [],
    valueField: 'value',
    labelField: 'label',
});

const emit = defineEmits<CheckboxGroupEmits>();

useTheme();
useCheckboxGroup(props, emit);
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
