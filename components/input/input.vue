/* eslint-disable no-undefined */
<template>
    <div :class="classes" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <template v-if="type !== 'textarea'">
            <div v-if="$slots.prepend" :class="`${prefixCls}-prepend`">
                <slot name="prepend"></slot>
            </div>
            <span :class="`${prefixCls}-inner-wrapper`">
                <input
                    ref="inputRef"
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
                    :class="`${prefixCls}-inner`"
                    @compositionstart="handleCompositionStart"
                    @compositionend="handleCompositionEnd"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @change="handleChange"
                    @keydown.enter="handleChange"
                    @keydown="handleKeydown"
                />
                <!-- 前置内容 -->
                <span v-if="$slots.prefix" :class="`${prefixCls}-prefix`">
                    <slot name="prefix"></slot>
                </span>
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
            @change="handleChange"
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

<script>
import {
    computed,
    toRefs,
    ref,
    shallowRef,
    watch,
    nextTick,
    onMounted,
} from 'vue';
import { isObject } from 'lodash-es';

import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { EyeOutlined, EyeInvisibleOutlined, CloseCircleFilled } from '../icon';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel } from '../_util/use/useModel';
import calcTextareaHeight from './calcTextareaHeight';

const prefixCls = getPrefixCls('input');
const textareaPrefixCls = getPrefixCls('textarea');

function usePassword(currentValue, showPassword, readonly, disabled, focused) {
    const passwordVisible = ref(false);

    const handlePasswordVisible = () => {
        passwordVisible.value = !passwordVisible.value;
    };

    const showPwdSwitchIcon = computed(
        () =>
            showPassword.value &&
            !readonly.value &&
            !disabled.value &&
            (currentValue.value != null || focused.value),
    );

    return {
        passwordVisible,
        handlePasswordVisible,
        showPwdSwitchIcon,
    };
}

function useClear(
    currentValue,
    clearable,
    readonly,
    disabled,
    focused,
    hovering,
    updateCurrentValue,
    emit,
) {
    const showClear = computed(
        () =>
            clearable.value &&
            !readonly.value &&
            !disabled.value &&
            currentValue.value &&
            (focused.value || hovering.value),
    );

    const clear = () => {
        updateCurrentValue('');
        emit('clear');
    };

    return {
        showClear,
        clear,
    };
}

function useFocus(emit, validate) {
    const focused = ref(false);

    const handleFocus = (event) => {
        focused.value = true;
        emit('focus', event);
    };

    const handleBlur = (event) => {
        focused.value = false;
        emit('blur', event);
        validate('blur');
    };

    return {
        focused,
        handleFocus,
        handleBlur,
    };
}

function useMouse(emit) {
    const hovering = ref(false);
    const onMouseLeave = (e) => {
        hovering.value = false;
        emit('mouseleave', e);
    };

    const onMouseEnter = (e) => {
        hovering.value = true;
        emit('mouseenter', e);
    };

    return {
        hovering,
        onMouseLeave,
        onMouseEnter,
    };
}

function useWordLimit(currentValue, showWordLimit, maxlength, disabled) {
    const isWordLimitVisible = computed(
        () => showWordLimit.value && maxlength.value && !disabled.value,
    );
    const textLength = computed(() => currentValue.value?.length || 0);
    return {
        isWordLimitVisible,
        textLength,
    };
}

export default {
    name: 'FInput',
    components: {
        EyeOutlined,
        EyeInvisibleOutlined,
        CloseCircleFilled,
    },
    props: {
        modelValue: {
            type: [Number, String],
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
            type: [Boolean, Object],
            default: false,
        },
        autocomplete: {
            type: String,
            default: 'off',
        },
    },
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
        const { validate } = useFormAdaptor();
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

        const { showClear, clear } = useClear(
            currentValue,
            clearable,
            readonly,
            disabled,
            focused,
            hovering,
            updateCurrentValue,
            emit,
        );

        const classes = computed(() => [
            props.type === 'textarea' ? textareaPrefixCls : prefixCls,
            {
                'is-disabled': props.disabled,
                'is-hovering': hovering.value,
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
        const handleInput = (event) => {
            const { value } = event.target;
            if (!isComposing.value) {
                updateCurrentValue(value);
                emit('input', value);
                validate('input');
            }
        };
        const handleCompositionStart = () => {
            isComposing.value = true;
        };
        const handleCompositionEnd = (event) => {
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
                const minRows = isObject(autosize)
                    ? autosize.minRows
                    : undefined; // eslint-disable-line no-undefined
                const maxRows = isObject(autosize)
                    ? autosize.maxRows
                    : undefined; // eslint-disable-line no-undefined
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

        const handleChange = (event) => {
            emit('change', event.target.value);
            validate('change');
        };
        const handleKeydown = (e) => {
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
            inputRef,
            textareaRef,
            prefixCls,
            textareaPrefixCls,
            classes,
            currentValue,

            suffixVisible,

            handleFocus,
            handleBlur,

            focus,
            blur,

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
};
</script>
