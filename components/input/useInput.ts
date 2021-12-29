import { ref, computed, Ref } from 'vue';
import type {
    UpdateCurrentValue,
    FormValidate,
    BooleanRef,
} from '../_util/interface';

import type { InputCurrentValue, InputEmits } from './interface';

export function usePassword(
    currentValue: InputCurrentValue,
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

export function useClear(
    currentValue: InputCurrentValue,
    clearable: BooleanRef,
    readonly: BooleanRef,
    disabled: BooleanRef,
    focused: BooleanRef,
    hovering: BooleanRef,
    updateCurrentValue: UpdateCurrentValue,
    emit: InputEmits,
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

export function useFocus(emit: InputEmits, validate: FormValidate) {
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

export function useMouse(emit: InputEmits) {
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

export function useWordLimit(
    currentValue: InputCurrentValue,
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
