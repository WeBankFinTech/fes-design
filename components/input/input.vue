/* eslint-disable no-undefined */
<template>
    <div :class="classes" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <template v-if="type !== 'textarea'">
            <div v-if="$slots.prepend" :class="`${prefixCls}-prepend`">
                <slot name="prepend"></slot>
            </div>
            <InputInner
                ref="inputRef"
                :modelValue="currentValue"
                :type="type"
                :placeholder="placeholder"
                :readonly="readonly"
                :disabled="innerDisabled"
                :clearable="clearable"
                :maxlength="maxlength"
                :showPassword="showPassword"
                :inputStyle="inputStyle"
                :autocomplete="autocomplete"
                :innerIsError="isError"
                @input="handleInput"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown="handleKeydown"
            >
                <template v-if="$slots.prefix" #prefix>
                    <slot name="prefix"></slot>
                </template>
                <template v-if="$slots.suffix || isWordLimitVisible" #suffix>
                    <slot name="suffix"></slot>
                    <span
                        v-if="isWordLimitVisible"
                        :class="`${prefixCls}-count`"
                    >
                        {{ textLength }}/{{ maxlength }}
                    </span>
                </template>
            </InputInner>

            <div v-if="$slots.append" :class="`${prefixCls}-append`">
                <slot name="append"></slot>
            </div>
        </template>

        <textarea
            v-else
            ref="textareaRef"
            :value="currentValue"
            :style="textareaStyle"
            :class="`${textareaPrefixCls}-inner`"
            :readonly="readonly"
            :disabled="innerDisabled"
            :autocomplete="autocomplete"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :rows="rows"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @input="handleInput"
            @change="handleTextareaChange"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown="handleKeydown"
        >
        </textarea>
        <span
            v-if="isWordLimitVisible && type === 'textarea'"
            :class="`${textareaPrefixCls}-count`"
        >
            {{ textLength }}/{{ maxlength }}
        </span>
    </div>
</template>

<script lang="ts">
import {
    computed,
    ref,
    shallowRef,
    watch,
    nextTick,
    onMounted,
    defineComponent,
    PropType,
    Ref,
} from 'vue';

import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel } from '../_util/use/useModel';
import { useInput } from '../_util/use/useInput';
import calcTextareaHeight from './calcTextareaHeight';
import InputInner from './inputInner.vue';
import { commonInputProps } from './props';
import { useFocus, useMouse } from './useInput';
import type { ExtractPublicPropTypes } from '../_util/interface';

import type { InputValue } from './interface';

const prefixCls = getPrefixCls('input');
const textareaPrefixCls = getPrefixCls('textarea');

export interface Autosize {
    minRows?: number;
    maxRows?: number;
}

export const inputProps = {
    ...commonInputProps,
    rows: {
        type: Number,
        default: 2,
    },
    showWordLimit: {
        type: Boolean,
        default: false,
    },
    autosize: {
        type: [Boolean, Object] as PropType<boolean | Autosize>,
        default: false,
    },
    resize: String as PropType<
        'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline'
    >,
} as const;

export type InputProps = ExtractPublicPropTypes<typeof inputProps>;

export function useWordLimit(currentValue: Ref<InputValue>, props: InputProps) {
    const isWordLimitVisible = computed(
        () => props.showWordLimit && props.maxlength && !props.disabled,
    );
    const textLength = computed(
        () => currentValue.value?.toString().length || 0,
    );
    return {
        isWordLimitVisible,
        textLength,
    };
}

export default defineComponent({
    name: 'FInput',
    components: {
        InputInner,
    },
    props: inputProps,
    emits: [
        UPDATE_MODEL_EVENT,
        'change',
        'input',
        'keydown',
        'blur',
        'focus',
        'clear',
        'mouseleave',
        'mouseenter',
    ],
    setup(props, { slots, emit }) {
        useTheme();
        const { validate, isError, isFormDisabled } = useFormAdaptor();
        const inputRef = ref();
        const textareaRef = ref();

        const { handleFocus, handleBlur } = useFocus(emit, validate);
        const { onMouseLeave, onMouseEnter } = useMouse(emit);

        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const handleChange = (value: InputValue) => {
            emit('change', value);
        };
        const handleTextareaChange = (event: Event) => {
            const { value } = event.target as HTMLInputElement;
            handleChange(value);
        };

        const handleValueChange = (value: string) => {
            updateCurrentValue(value);
            emit('input', value);
            // 对于 form 表单校验，Input 的 input 事件就是 change 事件
            validate('input');
            validate('change');
        };

        const classes = computed(() => [
            props.type === 'textarea' ? textareaPrefixCls : prefixCls,
            {
                'is-error': isError.value,
                [`${prefixCls}-group`]: slots.prepend || slots.append,
                [`${prefixCls}-group-prepend`]: slots.prepend,
                [`${prefixCls}-group-append`]: slots.append,
            },
        ]);

        const innerDisabled = computed(
            () => props.disabled || isFormDisabled.value,
        );

        const textareaCalcStyle = shallowRef(props.inputStyle);
        const textareaStyle = computed(() => [
            props.inputStyle,
            textareaCalcStyle.value,
            {
                resize: props.resize,
            },
        ]);
        const resizeTextarea = () => {
            const { type, autosize } = props;

            if (type !== 'textarea' || !textareaRef.value) return;

            if (autosize) {
                let minRows: number;
                let maxRows: number;
                if (typeof autosize === 'object') {
                    minRows = (autosize as Autosize).minRows;
                    maxRows = (autosize as Autosize).maxRows;
                }
                textareaCalcStyle.value = {
                    ...calcTextareaHeight(textareaRef.value, minRows, maxRows),
                };
            } else {
                textareaCalcStyle.value = {
                    minHeight: calcTextareaHeight(textareaRef.value).minHeight,
                };
            }
        };
        watch(
            () => props.modelValue,
            () => {
                nextTick(resizeTextarea);
            },
        );
        onMounted(() => {
            nextTick(resizeTextarea);
        });

        const handleKeydown = (e: KeyboardEvent) => {
            emit('keydown', e);
        };

        const currentInput = computed(() =>
            props.type === 'textarea' ? textareaRef.value : inputRef.value,
        );

        const focus = () => {
            currentInput.value.focus();
        };
        const blur = () => {
            currentInput.value.blur();
        };

        return {
            innerDisabled,
            isError,
            inputRef,
            textareaRef,
            prefixCls,
            textareaPrefixCls,
            classes,
            currentValue,

            ...useInput(handleValueChange),

            handleFocus,
            handleBlur,

            focus,
            blur,

            handleTextareaChange,
            handleChange,
            handleKeydown,

            onMouseLeave,
            onMouseEnter,

            textareaStyle,
            resizeTextarea,

            ...useWordLimit(currentValue, props),
        };
    },
});
</script>
