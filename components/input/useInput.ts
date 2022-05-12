import { ref } from 'vue';
import type { FormValidate } from '../_util/interface';

import type { InputEmits } from './interface';

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
