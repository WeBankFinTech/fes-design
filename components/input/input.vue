/* eslint-disable no-undefined */
<template>
    <div :class="classes" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <template v-if="type !== 'textarea'">
            <div v-if="$slots.prepend" :class="`${prefixCls}-prepend`">
                <slot name="prepend"></slot>
            </div>
            <span
                ref="wrapperElRef"
                :class="[
                    `${prefixCls}-inner`,
                    focused && `${prefixCls}-inner-focus`,
                    disabled && `${prefixCls}-inner-disabled`,
                ]"
                :tabindex="!disabled ? 0 : undefined"
                @mousedown="handleMousedown"
            >
                <!-- 前置内容 -->
                <span v-if="$slots.prefix" :class="`${prefixCls}-prefix`">
                    <slot name="prefix"></slot>
                </span>
                <input
                    ref="inputRef"
                    :tabindex="!disabled ? -1 : undefined"
                    :value="currentValue"
                    :maxlength="maxlength"
                    :type="
                        showPassword
                            ? passwordVisible
                                ? 'text'
                                : 'password'
                            : type
                    "
                    :readonly="readonly"
                    :disabled="disabled"
                    :placeholder="placeholder"
                    :autocomplete="autocomplete"
                    :style="inputStyle"
                    :class="`${prefixCls}-inner-el`"
                    @compositionstart="handleCompositionStart"
                    @compositionend="handleCompositionEnd"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @keydown="handleKeydown"
                />
                <!-- 后置内容 -->
                <span
                    v-if="suffixVisible"
                    :class="`${prefixCls}-suffix`"
                    @mousedown.prevent
                >
                    <template v-if="!showClear && !showPwdSwitchIcon">
                        <slot name="suffix"></slot>
                    </template>
                    <CloseCircleFilled
                        v-if="showClear"
                        :class="`${prefixCls}-icon`"
                        @click.stop="clear"
                    />
                    <template v-if="showPwdSwitchIcon">
                        <EyeOutlined
                            v-if="passwordVisible"
                            :class="`${prefixCls}-icon`"
                            @click.stop="handlePasswordVisible"
                        />
                        <EyeInvisibleOutlined
                            v-else
                            :class="`${prefixCls}-icon`"
                            @click.stop="handlePasswordVisible"
                        />
                    </template>
                </span>
            </span>

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
            :disabled="disabled"
            :autocomplete="autocomplete"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :rows="rows"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @input="handleInput"
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
    toRefs,
    ref,
    shallowRef,
    watch,
    nextTick,
    onMounted,
    defineComponent,
    PropType,
} from 'vue';

import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { EyeOutlined, EyeInvisibleOutlined, CloseCircleFilled } from '../icon';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel } from '../_util/use/useModel';
import calcTextareaHeight from './calcTextareaHeight';
import {
    usePassword,
    useClear,
    useFocus,
    useMouse,
    useWordLimit,
} from './useInput';

const prefixCls = getPrefixCls('input');
const textareaPrefixCls = getPrefixCls('textarea');

export interface Autosize {
    minRows?: number;
    maxRows?: number;
}

const inputProps = {
    modelValue: {
        type: [Number, String] as PropType<number | string>,
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false,
    },
    maxlength: {
        type: Number,
    },
    rows: {
        type: Number,
        default: 2,
    },
    showWordLimit: {
        type: Boolean,
        default: false,
    },
    showPassword: {
        type: Boolean,
        default: false,
    },
    inputStyle: {
        type: Object,
        default: () => ({}),
    },
    autosize: {
        type: [Boolean, Object] as PropType<boolean | Autosize>,
        default: false,
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
    resize: String as PropType<
        'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline'
    >,
} as const;

export default defineComponent({
    name: 'FInput',
    components: {
        EyeOutlined,
        EyeInvisibleOutlined,
        CloseCircleFilled,
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
        const { validate, isError } = useFormAdaptor();
        const wrapperElRef = ref<HTMLElement>();
        const inputRef = ref();
        const textareaRef = ref();

        const {
            showPassword,
            clearable,
            disabled,
            readonly,
            showWordLimit,
            maxlength,
        } = toRefs(props);
        const { focused, handleFocus, handleBlur } = useFocus(emit, validate);
        const { hovering, onMouseLeave, onMouseEnter } = useMouse(emit);

        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const handleChange = () => {
            emit('change', currentValue.value);
            validate('change');
        };

        const { showClear, clear } = useClear(
            currentValue,
            clearable,
            readonly,
            disabled,
            focused,
            hovering,
            updateCurrentValue,
            emit,
            handleChange,
        );

        const classes = computed(() => [
            props.type === 'textarea' ? textareaPrefixCls : prefixCls,
            {
                'is-error': isError.value,
                [`${prefixCls}-group`]: slots.prepend || slots.append,
                [`${prefixCls}-group-prepend`]: slots.prepend,
                [`${prefixCls}-group-append`]: slots.append,
                [`${prefixCls}-with-prefix`]: slots.prefix,
                [`${prefixCls}-with-suffix`]:
                    slots.suffix || props.showPassword || props.clearable,
                [`${prefixCls}-with-password-clear`]:
                    props.showPassword && props.clearable,
            },
        ]);

        const suffixVisible = computed(
            () => slots.suffix || props.showPassword || props.clearable,
        );

        const isComposing = ref(false);
        const handleInput = (event: Event) => {
            const { value } = event.target as HTMLInputElement;
            if (!isComposing.value) {
                updateCurrentValue(value);
                emit('input', value);
                validate('input');
                handleChange();
            }
        };
        const handleCompositionStart = () => {
            isComposing.value = true;
        };
        const handleCompositionEnd = (event: Event) => {
            if (isComposing.value) {
                isComposing.value = false;
                handleInput(event);
            }
        };

        const textareaCalcStyle = shallowRef(props.inputStyle);
        const textareaStyle = computed(() => ({
            ...props.inputStyle,
            ...textareaCalcStyle.value,
            resize: props.resize,
        }));
        const resizeTextarea = () => {
            const { type, autosize } = props;

            if (type !== 'textarea') return;

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
        const handleMousedown = (e: MouseEvent) => {
            if (props.disabled) return;
            const { tagName } = e.target as HTMLElement;
            if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (!focused.value) {
                    handleFocus(e);
                }
            }
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
            wrapperElRef,
            inputRef,
            textareaRef,
            prefixCls,
            textareaPrefixCls,
            classes,
            currentValue,

            suffixVisible,

            focused,
            handleFocus,
            handleBlur,

            focus,
            blur,

            handleMousedown,
            handleCompositionStart,
            handleCompositionEnd,
            handleInput,
            handleChange,
            handleKeydown,

            onMouseLeave,
            onMouseEnter,

            showClear,
            clear,

            textareaStyle,
            resizeTextarea,

            ...usePassword(
                currentValue,
                showPassword,
                readonly,
                disabled,
                focused,
            ),

            ...useWordLimit(currentValue, showWordLimit, maxlength, disabled),
        };
    },
});
</script>
