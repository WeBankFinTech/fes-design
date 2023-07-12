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

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import useSelect from '../_util/use/useSelect';
import { name, checkboxGroupKey } from '../checkbox-group/const';
import { useTheme } from '../_theme/useTheme';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('checkbox');

export const checkboxProps = {
    modelValue: Boolean,
    indeterminate: Boolean,
    value: [String, Number, Boolean] as PropType<string | number | boolean>,
    label: [String, Number] as PropType<string | number>,
    disabled: Boolean,
} as const;

export type CheckboxProps = ExtractPublicPropTypes<typeof checkboxProps>;

export default defineComponent({
    name: 'FCheckbox',
    props: checkboxProps,
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
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

        return {
            prefixCls,
            wrapperClass,
            handleClick,
            handleMouseOver,
            handleMouseOut,
        };
    },
});
</script>
