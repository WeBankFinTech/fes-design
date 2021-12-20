<template>
    <div :class="classList">
        <slot />
    </div>
</template>
<script>
import { computed } from 'vue';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useCheckboxGroup } from './useCheckboxGroup';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';

import { name } from './const';

const prefixCls = getPrefixCls('checkbox-group');
export default {
    name,
    componentName: name,
    props: {
        modelValue: {
            type: Array,
            default() {
                return [];
            },
        },
        vertical: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
    setup(props, ctx) {
        useTheme();
        useCheckboxGroup(props, ctx);
        const classList = computed(() => [
            prefixCls,
            props.vertical && 'is-vertical',
            props.disabled && 'is-disabled',
        ]);
        return {
            classList,
        };
    },
};
</script>
