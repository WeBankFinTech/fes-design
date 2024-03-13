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

<script lang="ts">
import { computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import useSelect from '../_util/use/useSelect';
import {
    COMPONENT_NAME as radioGroupName,
    radioGroupKey,
} from '../radio-group/const';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import { radioProps } from './props';

const prefixCls = getPrefixCls('radio');

export default defineComponent({
    name: 'FRadio',
    props: radioProps,
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
            parent: { groupKey: radioGroupKey, name: radioGroupName },
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
                if (group.props.vertical) {
                    arr.push('is-item-vertical');
                }
            }
            return arr;
        });

        return {
            prefixCls,
            handleClick,
            handleMouseOver,
            handleMouseOut,
            wrapperClass,
        };
    },
});
</script>
