/* eslint-disable no-undefined */
<template>
    <div :class="[...classes, ($slots.prepend || $slots.append) && `${prefixCls}-group`, $slots.prepend && `${prefixCls}-group-prepend`, $slots.append && `${prefixCls}-group-append`]" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @paste="handlePaste">
        <template v-if="type !== 'textarea'">
            <div v-if="$slots.prepend" :class="`${prefixCls}-prepend`">
                <slot name="prepend" />
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
                @clear="handleInputClear"
            >
                <template v-if="$slots.prefix" #prefix>
                    <slot name="prefix" />
                </template>
                <template v-if="$slots.suffix || isWordLimitVisible || isExceed" #suffix>
                    <slot name="suffix" />
                    <span
                        v-if="isWordLimitVisible || isExceed"
                        :class="[
                            `${prefixCls}-count`,
                            isExceed && 'is-exceed',
                        ]"
                    >
                        {{ textLength }}/{{ maxlength }}
                    </span>
                </template>
            </InputInner>

            <div v-if="$slots.append" :class="`${prefixCls}-append`">
                <slot name="append" />
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
        />
        <span
            v-if="(isWordLimitVisible || isExceed) && type === 'textarea'"
            :class="[
                `${textareaPrefixCls}-count`,
                isExceed && 'is-exceed',
            ]"
        >
            {{ textLength }}/{{ maxlength }}
        </span>
    </div>
</template>

<script lang="ts">
import {
    type ComponentObjectPropsOptions,
    type PropType,
    type Ref,
    computed,
    defineComponent,
    nextTick,
    onMounted,
    ref,
    shallowRef,
    watch,
} from 'vue';

import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel } from '../_util/use/useModel';
import { useInput } from '../_util/use/useInput';
import { useLocale } from '../config-provider/useLocale';
import { FMessage } from '../message';
import type { ExtractPublicPropTypes } from '../_util/interface';
import calcTextareaHeight from './calcTextareaHeight';
import InputInner from './inputInner.vue';
import { commonInputProps } from './props';
import { isPasteExceed, useFocus, useMouse } from './useInput';

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
        default: false as boolean | Autosize,
    },
    autofocus: {
        type: Boolean,
        default: false,
    },
    resize: String as PropType<
        'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline'
    >,
} as const satisfies ComponentObjectPropsOptions;

export type InputProps = ExtractPublicPropTypes<typeof inputProps>;

export function useWordLimit(currentValue: Ref<InputValue>, props: InputProps) {
    const isWordLimitVisible = computed(
        () => props.showWordLimit && props.maxlength && !props.disabled,
    );
    const textLength = computed(
        () => currentValue.value?.toString().length || 0,
    );
    // 程序赋值可能使 value 超过 maxlength（原生 maxlength 拦不住程序赋值），
    // 此时显示计数并标红提醒
    const isExceed = computed(
        () =>
            props.maxlength != null
            && textLength.value > props.maxlength,
    );
    return {
        isWordLimitVisible,
        textLength,
        isExceed,
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
    setup(props, { emit }) {
        useTheme();
        const { validate, isError, isFormDisabled } = useFormAdaptor();
        const { t } = useLocale();
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

            if (type !== 'textarea' || !textareaRef.value) {
                return;
            }

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
        watch(currentValue, () => {
            nextTick(resizeTextarea);
        });
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

        const handleInputClear = () => {
            emit('clear');
        };

        // 粘贴超长提示：paste 事件先于原生 maxlength 截断触发，
        // 此时剪贴板内容完整，可精确判断本次粘贴是否会超长。
        // 节流 500ms，避免连续粘贴刷屏。
        let lastExceedTipTime = 0;
        const handlePaste = (event: ClipboardEvent) => {
            if (props.disabled || props.readonly) {
                return;
            }
            if (!isPasteExceed(event, props.maxlength)) {
                return;
            }
            const now = Date.now();
            if (now - lastExceedTipTime < 500) {
                return;
            }
            lastExceedTipTime = now;
            FMessage.warning(
                t('input.pasteExceed', { max: String(props.maxlength) }),
            );
        };

        onMounted(() => {
            if (props.autofocus) {
                focus();
            }
        });

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
            handleInputClear,
            handlePaste,

            onMouseLeave,
            onMouseEnter,

            textareaStyle,

            ...useWordLimit(currentValue, props),
        };
    },
});
</script>
