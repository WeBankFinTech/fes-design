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
<script>
import { computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import useSelect from '../_util/use/useSelect';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import { name, radioGroupKey } from '../radio-group/const';

const prefixCls = getPrefixCls('radio');

export default {
    name: 'FRadio',
    componentName: 'FRadio',
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        value: {
            type: [String, Number, Boolean],
            default: null,
        },
        label: {
            type: [String, Number, Boolean],
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
    setup(props, ctx) {
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
            ctx,
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
            if (isGroup.value) {
                arr.push('is-item');
                if (group.props.vertical) {
                    arr.push('is-item-vertical');
                }
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
};
</script>
