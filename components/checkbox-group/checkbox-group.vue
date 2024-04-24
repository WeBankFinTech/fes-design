<template>
    <div :class="classList">
        <slot />
        <Checkbox
            v-for="opt in optionsRef"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
            :disabled="opt.disabled"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import Checkbox from '../checkbox';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import { useCheckboxGroup } from './useCheckboxGroup';
import { COMPONENT_NAME } from './const';
import { checkboxGroupProps } from './props';

const prefixCls = getPrefixCls('checkbox-group');

export default defineComponent({
    name: COMPONENT_NAME,
    components: {
        Checkbox,
    },
    props: checkboxGroupProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
    setup(props, { emit }) {
        useTheme();
        const { isFormDisabled } = useCheckboxGroup(props, emit);
        const classList = computed(() => [
            prefixCls,
            props.vertical && 'is-vertical',
            (isFormDisabled.value || props.disabled) && 'is-disabled',
        ]);

        const optionsRef = computed(() =>
            props.options
                ? props.options.map((opt: any) => {
                    return {
                        ...opt,
                        value: opt[props.valueField],
                        label: opt[props.labelField],
                    };
                })
                : [],
        );

        return {
            classList,
            optionsRef,
        };
    },
});
</script>
