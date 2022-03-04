import { ref } from 'vue';
import type { FormValidate } from '../_util/interface';

import type { InputValue, InputEmits } from './interface';

export function useFocus(emit: InputEmits, validate: FormValidate) {
    const focused = ref(false);

    const handleFocus = (event: Event) => {
        focused.value = true;
        emit('focus', event);
    };

    const handleBlur = (event: Event) => {
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

export function useMouse(
    emit: (event: 'mouseleave' | 'mouseenter', e: Event) => void,
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

export function useInput(updateValue: (val: InputValue) => void) {
    const isComposing = ref(false);
    const handleInput = (event: Event | InputValue) => {
        if (!isComposing.value) {
            if (event instanceof Event) {
                const { value } = event.target as HTMLInputElement;
                updateValue(value);
            } else {
                updateValue(event);
            }
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

    return {
        handleInput,
        handleCompositionStart,
        handleCompositionEnd,
    };
}
