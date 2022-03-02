<template>
    <span
        ref="inputRangeRefEl"
        :class="[
            prefixCls,
            disabled && 'is-disabled',
            innerIsFocus && 'is-foused',
        ]"
        :tabindex="disabled ? null : 0"
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

<script lang="ts">
import { computed, ref, defineComponent, PropType } from 'vue';
import { isArray } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { CloseCircleFilled } from '../icon';

import { DATE_TYPE } from './const';
import { isEmptyValue, timeFormat } from './helper';

const prefixCls = getPrefixCls('range-input');

const rangeInputProps = {
    type: String as PropType<keyof typeof DATE_TYPE>,
    selectedDates: {
        type: Array as PropType<number[]>,
        default: () => [] as number[],
    },
    separator: String,
    clearable: Boolean,
    disabled: {
        type: Boolean,
        default: false,
    },
    placeholder: [String, Array] as PropType<string | string[]>,
    innerIsFocus: Boolean,
} as const;

function useMouse(
    emit: (event: 'mouseleave' | 'mouseenter', ...args: any[]) => void,
) {
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

export default defineComponent({
    components: {
        CloseCircleFilled,
    },
    props: rangeInputProps,
    emits: ['clear', 'blur', 'focus', 'mouseleave', 'mouseenter'],
    setup(props, { emit }) {
        const inputRangeRefEl = ref<HTMLElement>();
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

        const { hovering, onMouseLeave, onMouseEnter } = useMouse(emit);

        const showClear = computed(
            () =>
                props.clearable &&
                !props.disabled &&
                props.selectedDates?.length &&
                hovering.value,
        );

        const clear = () => {
            emit('clear');
        };

        const focus = () => {
            if (!props.disabled) {
                inputRangeRefEl.value.focus();
            }
        };
        const blur = () => {
            inputRangeRefEl.value.blur();
        };

        return {
            inputRangeRefEl,
            prefixCls,
            innerPlaceHolder,

            focus,
            blur,

            dateTexts,

            onMouseLeave,
            onMouseEnter,

            showClear,
            clear,
        };
    },
});
</script>
