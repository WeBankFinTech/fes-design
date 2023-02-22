<template>
    <label
        :class="wrapperClass"
        @click="handleClick"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
    >
        <span :class="`${prefixCls}-inner`" />
        <span v-if="$slots.default || label" :class="`${prefixCls}-content`">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import useSelect from '../_util/use/useSelect';
import { name, checkboxGroupKey } from '../checkbox-group/const';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('checkbox');

type CheckboxProps = {
    modelValue?: boolean;
    indeterminate?: boolean;
    value?: string | number | boolean;
    label?: string | number;
    disabled?: boolean;
};

const props = withDefaults(defineProps<CheckboxProps>(), {
    modelValue: false,
    disabled: false,
    indeterminate: false,
});

type CheckboxEmits = {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'change', value: boolean): void;
};

const emit = defineEmits<CheckboxEmits>();

useTheme();
const {
    isGroup,
    group,
    hover,
    checked,
    innerDisabled,
    handleClick,
    handleMouseOver,
    handleMouseOut,
} = useSelect({
    props,
    emit,
    parent: { groupKey: checkboxGroupKey, name },
});
const wrapperClass = computed(() => {
    const arr = [`${prefixCls}`];
    if (checked.value) {
        arr.push('is-checked');
    }
    if (innerDisabled.value) {
        arr.push('is-disabled');
    }
    if (hover.value) {
        arr.push('is-hover');
    }
    if (isGroup) {
        arr.push('is-item');
        if (group?.props?.vertical) {
            arr.push('is-item-vertical');
        }
    }
    if (props.indeterminate) {
        arr.push('is-indeterminate');
    }
    return arr;
});
</script>

<script lang="ts">
export default {
    name: 'FCheckbox',
};
</script>
