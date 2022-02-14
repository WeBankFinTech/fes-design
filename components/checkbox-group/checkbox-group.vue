<template>
    <div :class="classList">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useCheckboxGroup } from './useCheckboxGroup';

const prefixCls = getPrefixCls('checkbox-group');

// 由于 vue setup 的限制，声明文件必须放在同一个文件中
// https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md#type-only-propsemit-declarations
export type CheckboxGroupProps = {
    modelValue?: [];
    vertical?: boolean;
    disabled?: boolean;
};

export type CheckboxGroupEmits = {
    (e: 'update:modelValue', value: string | number | boolean): void;
    (e: 'change', value: string | number | boolean): void;
};

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
    modelValue: () => [],
    vertical: false,
    disabled: false,
});

const emit = defineEmits<CheckboxGroupEmits>();

useTheme();
useCheckboxGroup(props, emit);
const classList = computed(() => [
    prefixCls,
    props.vertical && 'is-vertical',
    props.disabled && 'is-disabled',
]);
</script>

<script lang="ts">
import { name } from './const';
export default {
    name,
};
</script>
