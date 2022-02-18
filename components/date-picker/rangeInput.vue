<template>
    <span
        :class="[
            prefixCls,
            disabled && 'is-disabled',
            innerIsFocus && 'is-foused',
        ]"
        tabindex="0"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @focus="(e) => $emit('focus', e)"
        @blur="(e) => $emit('blur', e)"
    >
        <input
            :class="`${prefixCls}-inner`"
            :value="dateTexts[0]"
            :placeholder="innerPlaceHolder[0]"
            readonly
        />
        <span :class="`${prefixCls}-separator`">
            <slot name="separator"></slot>
        </span>
        <input
            :class="`${prefixCls}-inner`"
            :value="dateTexts[1]"
            :placeholder="innerPlaceHolder[1]"
            readonly
        />
        <span :class="`${prefixCls}-suffix`" @mousedown.prevent>
            <CloseCircleFilled v-if="showClear" @click.stop="clear" />
            <slot v-else name="suffix"></slot>
        </span>
    </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { isArray } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { CloseCircleFilled } from '../icon';

import { DATE_TYPE } from './const';
import { isEmptyValue, timeFormat } from './helper';

const prefixCls = getPrefixCls('range-input');

type RangeInputProps = {
    type: keyof typeof DATE_TYPE;
    selectedDates?: number[];
    separator?: string;
    clearable?: boolean;
    disabled?: boolean;
    placeholder?: string | string[];
    innerIsFocus?: boolean;
};

type RangeInputEmits = {
    (e: 'clear'): void;
    (e: 'blur', event: Event): void;
    (e: 'focus', event: Event): void;
    (e: 'mouseleave', event: MouseEvent): void;
    (e: 'mouseenter', event: MouseEvent): void;
};

const props = withDefaults(defineProps<RangeInputProps>(), {
    selectedDates: () => [],
    disabled: false,
});

const emit = defineEmits<RangeInputEmits>();

function useFocus(emit: RangeInputEmits) {
    const focused = ref(false);

    const handleFocus = (event: Event) => {
        focused.value = true;
        emit('focus', event);
    };

    const handleBlur = (event: Event) => {
        focused.value = false;
        emit('blur', event);
    };

    return {
        focused,
        handleFocus,
        handleBlur,
    };
}

function useMouse(emit: RangeInputEmits) {
    const hovering = ref(false);
    const onMouseLeave = (e: MouseEvent) => {
        hovering.value = false;
        emit('mouseleave', e);
    };

    const onMouseEnter = (e: MouseEvent) => {
        hovering.value = true;
        emit('mouseenter', e);
    };

    return {
        hovering,
        onMouseLeave,
        onMouseEnter,
    };
}

const innerPlaceHolder = computed(() =>
    isArray(props.placeholder)
        ? props.placeholder
        : [props.placeholder, props.placeholder],
);

const dateTexts = computed(() => {
    if (isEmptyValue(props.selectedDates)) {
        return [];
    }
    const format = DATE_TYPE[props.type].format;
    return [
        timeFormat(props.selectedDates[0], format),
        timeFormat(props.selectedDates[1], format),
    ];
});

const { focused } = useFocus(emit);

const { hovering, onMouseLeave, onMouseEnter } = useMouse(emit);

const showClear = computed(
    () =>
        props.clearable &&
        !props.disabled &&
        props.selectedDates?.length &&
        (focused.value || hovering.value),
);

const clear = () => {
    emit('clear');
};
</script>
