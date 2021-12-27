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
    Ref,
} from 'vue';

import { UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { EyeOutlined, EyeInvisibleOutlined, CloseCircleFilled } from '../icon';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel } from '../_util/use/useModel';
import calcTextareaHeight from './calcTextareaHeight';

import type {
    UpdateCurrentValue,
    FormValidate,
    Emit,
    BooleanRef,
} from '../_util/interface';

const prefixCls = getPrefixCls('input');
const textareaPrefixCls = getPrefixCls('textarea');

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
    resize: {
        type: String,
        default: 'none',
    },
} as const;

type CurrentValue = Ref<number | string>;

function usePassword(
    currentValue: CurrentValue,
    showPassword: BooleanRef,
    readonly: BooleanRef,
    disabled: BooleanRef,
    focused: BooleanRef,
) {
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
    currentValue: CurrentValue,
    clearable: BooleanRef,
    readonly: BooleanRef,
    disabled: BooleanRef,
    focused: BooleanRef,
    hovering: BooleanRef,
    updateCurrentValue: UpdateCurrentValue,
    emit: Emit,
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

function useFocus(emit: Emit, validate: FormValidate) {
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

function useMouse(emit: Emit) {
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

function useWordLimit(
    currentValue: CurrentValue,
    showWordLimit: BooleanRef,
    maxlength: Ref<number>,
    disabled: BooleanRef,
) {
    const isWordLimitVisible = computed(
        () => showWordLimit.value && maxlength.value && !disabled.value,
    );
    const textLength = computed(
        () => currentValue.value?.toString().length || 0,
    );
    return {
        isWordLimitVisible,
        textLength,
    };
}

interface Autosize {
    minRows?: number;
    maxRows?: number;
}

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
                const minRows = autosize.minRows;
                const maxRows = autosize.maxRows;
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

        const handleChange = (event: Event) => {
            emit('change', (event.target as HTMLInputElement).value);
            validate('change');
        };
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
});
</script>
