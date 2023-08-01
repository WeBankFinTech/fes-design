<template>
    <span
        :class="[
            prefixCls,
            (focused || innerIsFocus) && `${prefixCls}-focus`,
            disabled && `${prefixCls}-disabled`,
            innerIsError && `${prefixCls}-error`,
        ]"
        @mousedown="handleMousedown"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <!-- 前置内容 -->
        <span v-if="$slots.prefix" :class="`${prefixCls}-prefix`">
            <slot name="prefix"></slot>
        </span>
        <input
            ref="inputRefEl"
            :tabindex="!disabled ? 0 : undefined"
            :value="currentValue"
            :maxlength="maxlength"
            :type="
                showPassword ? (passwordVisible ? 'text' : 'password') : type
            "
            :readonly="!canEdit || readonly"
            :disabled="disabled"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :style="inputStyle"
            :class="`${prefixCls}-el`"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @input="handleInput"
            @change="handleChange"
            @keydown.enter="handleChange"
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
</template>

<script lang="ts">
import { computed, ref, defineComponent, Ref, ExtractPropTypes } from 'vue';
import { debounce } from 'lodash-es';
import { EyeOutlined, EyeInvisibleOutlined, CloseCircleFilled } from '../icon';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';

import { useInput } from '../_util/use/useInput';
import { useMouse } from './useInput';
import { commonInputProps } from './props';
import type { InputValue } from './interface';

const inputInnerProps = {
    ...commonInputProps,
    // 内部使用，处理页面存在多个 input focus 样式场景
    innerIsFocus: Boolean,
    innerIsError: Boolean,
    canEdit: {
        type: Boolean,
        default: true,
    },
} as const;

const prefixCls = getPrefixCls('input-inner');

type InputInnerProps = Partial<ExtractPropTypes<typeof inputInnerProps>>;

export function usePassword(
    currentValue: Ref<InputValue>,
    props: InputInnerProps,
    focused: Ref<boolean>,
) {
    const passwordVisible = ref(false);

    const handlePasswordVisible = () => {
        passwordVisible.value = !passwordVisible.value;
    };

    const showPwdSwitchIcon = computed(
        () =>
            props.showPassword &&
            !props.readonly &&
            !props.disabled &&
            (currentValue.value != null || focused.value),
    );

    return {
        passwordVisible,
        handlePasswordVisible,
        showPwdSwitchIcon,
    };
}

export function useClear(
    currentValue: Ref<InputValue>,
    props: InputInnerProps,
    focused: Ref<boolean>,
    hovering: Ref<boolean>,
    handleValueChange: (val: string) => void,
    emit: (event: 'clear') => void,
) {
    const showClear = computed(
        () =>
            props.clearable &&
            !props.readonly &&
            !props.disabled &&
            currentValue.value &&
            (focused.value || hovering.value),
    );

    const clear = () => {
        if (currentValue.value !== '') {
            handleValueChange('');
        }
        emit('clear');
    };

    return {
        showClear,
        clear,
    };
}

export default defineComponent({
    name: 'FInputInner',
    components: {
        EyeOutlined,
        EyeInvisibleOutlined,
        CloseCircleFilled,
    },
    props: inputInnerProps,
    emits: [
        UPDATE_MODEL_EVENT,
        'input',
        'focus',
        'blur',
        'change',
        'clear',
        'keydown',
        'mouseleave',
        'mouseenter',
    ],
    setup(props, { slots, emit }) {
        const inputRefEl = ref<HTMLElement>();
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
        const suffixVisible = computed(
            () => slots.suffix || props.showPassword || props.clearable,
        );

        const handleValueChange = (value: string) => {
            updateCurrentValue(value);
            emit('input', value);
        };

        const focused = ref(false);
        const handleFocus = (event: Event) => {
            focused.value = true;
            emit('focus', event);
        };
        const handleBlur = (event: Event) => {
            focused.value = false;
            emit('blur', event);
        };

        const { hovering, onMouseLeave, onMouseEnter } = useMouse(emit);

        const handleChange = debounce((event: Event) => {
            const { value } = event.target as HTMLInputElement;
            emit('change', value);
        });

        const handleKeydown = (e: KeyboardEvent) => {
            emit('keydown', e);
        };

        const { showClear, clear } = useClear(
            currentValue,
            props,
            focused,
            hovering,
            handleValueChange,
            emit,
        );

        const focus = () => {
            inputRefEl.value.focus();
        };
        const blur = () => {
            inputRefEl.value.blur();
        };

        const handleMousedown = (e: MouseEvent) => {
            if (props.disabled) return;
            const { tagName } = e.target as HTMLElement;
            if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (!focused.value) {
                    focus();
                }
            }
        };
        return {
            inputRefEl,
            // 外部使用
            focus,
            blur,

            focused,
            handleFocus,
            handleBlur,

            showClear,
            clear,

            handleChange,
            onMouseLeave,
            onMouseEnter,
            handleMousedown,
            handleKeydown,
            prefixCls,

            suffixVisible,
            currentValue,

            ...useInput(handleValueChange),

            ...usePassword(currentValue, props, focused),
        };
    },
});
</script>
