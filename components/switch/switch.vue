<template>
    <div :class="wrapperClass" @click="toggle">
        <span :class="`${prefixCls}-inner`">
            <slot v-if="actived" name="active"></slot>
            <slot v-if="inactived" name="inactive"></slot>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { isEqual, isFunction } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';

import { CHANGE_EVENT } from '../_util/constants';

import type { VModelEvent, ChangeEvent } from '../_util/interface';

const prefixCls = getPrefixCls('switch');

type SwitchValue = string | [] | object | number | boolean;
type SwitchSize = 'normal' | 'small';

interface SwitchProps {
    modelValue?: SwitchValue;
    disabled?: boolean;
    activeValue?: SwitchValue;
    inactiveValue?: SwitchValue;
    beforeChange?: (val: SwitchValue) => boolean | Promise<boolean>;
    size?: SwitchSize;
}

type SwitchEmits = {
    (e: VModelEvent, value: SwitchValue): void;
    (e: ChangeEvent, value: SwitchValue): void;
};

const props = withDefaults(defineProps<SwitchProps>(), {
    disabled: false,
    activeValue: true,
    inactiveValue: false,
    size: 'normal',
});

const emit = defineEmits<SwitchEmits>();

useTheme();
const [currentValue, updateCurrentValue] = useNormalModel(props, emit, {
    prop: 'modelValue',
    isEqual: true,
});
onMounted(() => {
    // 默认为未选中
    if (currentValue.value === null) {
        updateCurrentValue(props.inactiveValue);
    }
});

watch(currentValue, () => {
    emit(CHANGE_EVENT, currentValue.value);
});
const actived = computed(() => isEqual(currentValue.value, props.activeValue));
const inactived = computed(() =>
    isEqual(currentValue.value, props.inactiveValue),
);
const toggle = async () => {
    if (props.disabled) return;
    if (isFunction(props.beforeChange)) {
        const confirm = await props.beforeChange(currentValue.value);
        if (!confirm) {
            return;
        }
    }
    updateCurrentValue(actived.value ? props.inactiveValue : props.activeValue);
};
const wrapperClass = computed(() =>
    [
        prefixCls,
        props.size && `${prefixCls}-size-${props.size}`,
        actived.value && 'is-checked',
        props.disabled && 'is-disabled',
    ].filter(Boolean),
);
</script>

<script lang="ts">
export default {
    name: 'FSwitch',
};
</script>
