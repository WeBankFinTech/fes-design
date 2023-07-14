<template>
    <div :class="classList">
        <slot />
        <template v-if="optionType === 'default'">
            <FRadio
                v-for="opt in optionsRef"
                :key="opt.value"
                :value="opt.value"
                :label="opt.label"
                :disabled="opt.disabled || isFormDisabled"
            ></FRadio>
        </template>
        <template v-else>
            <RadioButton
                v-for="opt in optionsRef"
                :key="opt.value"
                :value="opt.value"
                :label="opt.label"
                :disabled="opt.disabled || isFormDisabled"
            ></RadioButton>
        </template>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import { useTheme } from '../_theme/useTheme';
import FRadio from '../radio';
import RadioButton from '../radio-button';
import { useRadioGroup } from './useRadioGroup';
import { name, radioGroupProps } from './const';

const prefixCls = getPrefixCls('radio-group');

export default defineComponent({
    name,
    components: {
        FRadio,
        RadioButton,
    },
    props: radioGroupProps,
    emits: [CHANGE_EVENT, UPDATE_MODEL_EVENT],
    setup(props, { emit }) {
        useTheme();
        const { isFormDisabled } = useRadioGroup(props, emit);

        const classList = computed(() => [
            prefixCls,
            props.vertical && 'is-vertical',
            props.fullLine && 'is-full-line',
            (props.disabled || isFormDisabled.value) && 'is-disabled',
        ]);

        const optionsRef = computed(() =>
            props.options.map((opt: any) => {
                return {
                    ...opt,
                    value: opt[props.valueField],
                    label: opt[props.labelField],
                };
            }),
        );

        return {
            classList,
            optionsRef,
            isFormDisabled,
        };
    },
});
</script>
