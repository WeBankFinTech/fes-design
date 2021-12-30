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

import type { CheckboxGroupProps, CheckboxGroupEmits } from './interface';

const prefixCls = getPrefixCls('checkbox-group');

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

<script>
import { name } from './const';
export default {
    name,
};
</script>
