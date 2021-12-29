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

<script setup lang="ts">
import {
    computed,
    toRefs,
    ref,
    shallowRef,
    watch,
    nextTick,
    onMounted,
    useSlots,
} from 'vue';

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

import type { InputCurrentValue, InputEmits } from './interface';

const prefixCls = getPrefixCls('input');
const textareaPrefixCls = getPrefixCls('textarea');

type InputProps = {
    modelValue?: InputCurrentValue;
    type?: string; // default text
    placeholder?: string;
    readonly?: boolean;
    disabled: boolean;
    clearable: boolean;
    maxlength: number;
    rows: number; // default 2
    showWordLimit: boolean;
    showPassword: boolean;
    inputStyle: object;
    autosize: boolean | Autosize;
    autocomplete: string; // default 'off'
    resize: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline';
};

interface Autosize {
    minRows?: number;
    maxRows?: number;
}

const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    rows: 2,
    autocomplete: 'off',
    resize: 'none',
});
const emit = defineEmits<InputEmits>();

const slots = useSlots();
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
        let minRows: number;
        let maxRows: number;
        if (typeof autosize === 'object') {
            minRows = autosize.minRows;
            maxRows = autosize.maxRows;
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

const handleChange = (event: Event) => {
    emit('change', (event.target as HTMLInputElement).value);
    validate('change');
};
const handleKeydown = (e: KeyboardEvent) => {
    emit('keydown', e);
};

const { passwordVisible, handlePasswordVisible, showPwdSwitchIcon } =
    usePassword(currentValue, showPassword, readonly, disabled, focused);
const { isWordLimitVisible, textLength } = useWordLimit(
    currentValue,
    showWordLimit,
    maxlength,
    disabled,
);

const currentInput = computed(() =>
    props.type === 'textarea' ? textareaRef.value : inputRef.value,
);

const focus = () => {
    currentInput.value.focus();
};
const blur = () => {
    currentInput.value.blur();
};
defineExpose({
    focus,
    blur,
});
</script>

<script>
export default {
    name: 'FInput',
};
</script>
