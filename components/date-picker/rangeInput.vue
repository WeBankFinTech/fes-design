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
        @focus="onFocus"
        @blur="onBlur"
    >
        <input
            :class="`${prefixCls}-inner`"
            :value="leftInputText"
            :placeholder="innerPlaceHolder[0]"
            @compositionstart="onLeftCompositionStart"
            @compositionend="onLeftCompositionEnd"
            @input="onLeftInput"
            @focus="onFocus"
            @blur="onBlur"
        />
        <span :class="`${prefixCls}-separator`">
            <slot name="separator"></slot>
        </span>
        <input
            :class="`${prefixCls}-inner`"
            :value="rightInputText"
            :placeholder="innerPlaceHolder[1]"
            @compositionstart="onRightCompositionStart"
            @compositionend="onRightCompositionEnd"
            @input="onRightInput"
            @focus="onFocus"
            @blur="onBlur"
        />
        <span :class="`${prefixCls}-suffix`" @mousedown.prevent>
            <CloseCircleFilled v-if="showClear" @click.stop="clear" />
            <slot v-else name="suffix"></slot>
        </span>
    </span>
</template>

<script lang="ts">
import {
    computed,
    watch,
    ref,
    defineComponent,
    PropType,
    ExtractPropTypes,
    nextTick,
} from 'vue';
import { isArray } from 'lodash-es';
import { format, isValid } from 'date-fns';

import getPrefixCls from '../_util/getPrefixCls';
import { useInput } from '../_util/use/useInput';
import { CloseCircleFilled } from '../icon';
import { isEmptyValue, strictParse } from './helper';

const prefixCls = getPrefixCls('range-input');

const rangeInputProps = {
    format: String as PropType<string>,
    selectedDates: {
        type: Array as PropType<number[]>,
    },
    changeSeletedDates: Function as PropType<(val: number | number[]) => void>,
    separator: String,
    clearable: Boolean,
    disabled: {
        type: Boolean,
        default: false,
    },
    placeholder: [String, Array] as PropType<string | string[]>,
    innerIsFocus: Boolean,
} as const;

type RangeInputProps = Partial<ExtractPropTypes<typeof rangeInputProps>>;

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

function useRangeInput(props: RangeInputProps, position: number) {
    const inputText = ref();
    watch(
        () => props.selectedDates,
        () => {
            inputText.value = isEmptyValue(props.selectedDates)
                ? ''
                : format(props.selectedDates[position], props.format);
        },
        {
            immediate: true,
        },
    );
    const updateInputText = (val: string) => {
        inputText.value = val;
        const date = strictParse(val, props.format, new Date());
        if (isValid(date)) {
            // update selectedDates
            const dates = [...props.selectedDates];
            dates[position] = date.getTime();
            props.changeSeletedDates(dates);
        }
    };
    const { handleInput, handleCompositionStart, handleCompositionEnd } =
        useInput(updateInputText);

    return {
        inputText,
        handleInput,
        handleCompositionStart,
        handleCompositionEnd,
    };
}

function useLeftInput(props: RangeInputProps) {
    const {
        inputText,
        handleInput,
        handleCompositionStart,
        handleCompositionEnd,
    } = useRangeInput(props, 0);

    return {
        leftInputText: inputText,
        onLeftInput: handleInput,
        onLeftCompositionStart: handleCompositionStart,
        onLeftCompositionEnd: handleCompositionEnd,
    };
}

function useRightInput(props: RangeInputProps) {
    const {
        inputText,
        handleInput,
        handleCompositionStart,
        handleCompositionEnd,
    } = useRangeInput(props, 1);

    return {
        rightInputText: inputText,
        onRightInput: handleInput,
        onRightCompositionStart: handleCompositionStart,
        onRightCompositionEnd: handleCompositionEnd,
    };
}

function useFocusBlur(
    props: RangeInputProps,
    emit: (event: 'focus' | 'blur', ...args: any[]) => void,
) {
    const isFocus = ref(false);

    let againFocusFlag = false;

    watch(
        () => props.innerIsFocus,
        () => {
            if (props.innerIsFocus) {
                isFocus.value = true;
            }
        },
    );

    const onFocus = (e: FocusEvent) => {
        againFocusFlag = true;
        if (!isFocus.value) {
            isFocus.value = true;
            emit('focus', e);
        }
    };

    const onBlur = (e: FocusEvent) => {
        // 延迟 blur，防止 focus 内部的 input 触发 blur
        nextTick(() => {
            if (isFocus.value && !againFocusFlag) {
                isFocus.value = false;
                emit('blur', e);
            }
            againFocusFlag = false;
        });
    };

    return {
        onFocus,
        onBlur,
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

        const { hovering, onMouseLeave, onMouseEnter } = useMouse(emit);

        const {
            leftInputText,
            onLeftInput,
            onLeftCompositionStart,
            onLeftCompositionEnd,
        } = useLeftInput(props);

        const {
            rightInputText,
            onRightInput,
            onRightCompositionStart,
            onRightCompositionEnd,
        } = useRightInput(props);

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

        const { onFocus, onBlur } = useFocusBlur(props, emit);

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

            leftInputText,
            onLeftInput,
            onLeftCompositionStart,
            onLeftCompositionEnd,

            rightInputText,
            onRightInput,
            onRightCompositionStart,
            onRightCompositionEnd,

            onFocus,
            onBlur,

            focus,
            blur,

            onMouseLeave,
            onMouseEnter,

            showClear,
            clear,
        };
    },
});
</script>
