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
import { computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import useSelect from '../_util/use/useSelect';
import {
    COMPONENT_NAME as checkboxGroupName,
    checkboxGroupKey,
} from '../checkbox-group/const';
import { useTheme } from '../_theme/useTheme';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import { checkboxProps } from './props';

const prefixCls = getPrefixCls('checkbox');

export default defineComponent({
    name: 'FCheckbox',
    props: checkboxProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
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
            parent: { groupKey: checkboxGroupKey, name: checkboxGroupName },
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
