<template>
    <label
        :class="wrapperClass"
        @click="handleClick"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
    >
        <span :class="`${prefixCls}-inner`" />
        <span :class="`${prefixCls}-content`">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import useSelect from '../_util/use/useSelect';
import { name, radioGroupKey } from '../radio-group/const';

import type { VModelEvent, ChangeEvent, Option } from '../_util/interface';

const prefixCls = getPrefixCls('radio');

type RadioProps = {
    modelValue?: boolean;
} & Option;

type RadioEmits = {
    (e: VModelEvent, value: string | number | boolean): void;
    (e: ChangeEvent, value: string | number | boolean): void;
};

const props = withDefaults(defineProps<RadioProps>(), {
    modelValue: false,
    disabled: false,
});

const emit = defineEmits<RadioEmits>();

useTheme();
const {
    isGroup,
    group,
    hover,
    checked,
    disabled,
    handleClick,
    handleMouseOver,
    handleMouseOut,
} = useSelect({
    props,
    emit,
    parent: { groupKey: radioGroupKey, name },
});
const wrapperClass = computed(() => {
    const arr = [`${prefixCls}`];
    if (checked.value) {
        arr.push('is-checked');
    }
    if (disabled.value) {
        arr.push('is-disabled');
    }
    if (hover.value) {
        arr.push('is-hover');
    }
    if (isGroup) {
        arr.push('is-item');
        if (group.props.vertical) {
            arr.push('is-item-vertical');
        }
    }
    return arr;
});
</script>

<script lang="ts">
export default {
    name: 'FRadio',
};
</script>
