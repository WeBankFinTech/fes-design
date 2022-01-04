<template>
    <div :class="classList">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useRadioGroup } from './useRadioGroup';

export type RadioGroupProps = {
    modelValue?: string | number | boolean;
    vertical?: boolean;
    disabled?: boolean;
};

export type RadioGroupEmits = {
    (e: 'update:modelValue', value: string | number | boolean): void;
    (e: 'change', value: string | number | boolean): void;
};

const prefixCls = getPrefixCls('radio-group');

const props = withDefaults(defineProps<RadioGroupProps>(), {
    vertical: false,
    disabled: false,
});

const emit = defineEmits<RadioGroupEmits>();

useTheme();
useRadioGroup(props, emit);
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
