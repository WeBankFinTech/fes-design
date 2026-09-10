import { ref } from 'vue';
import type { FormValidate } from '../_util/interface';

import type { InputEmits } from './interface';

export interface InputExceedPayload {
    /** 本次粘贴的内容长度 */
    pasteLength: number;
    /** 粘贴前输入框已有内容长度 */
    currentLength: number;
    /** 设置的最大长度 */
    maxlength: number;
}

/**
 * 粘贴会先于浏览器原生 maxlength 截断触发，
 * 此时 clipboardData 中仍是完整内容，可据此判断本次粘贴是否会超长。
 * 返回 null 表示不会触发超长（无需通知）。
 */
export function getPasteExceedPayload(
    event: Event,
    maxlength?: number,
): InputExceedPayload | null {
    if (maxlength == null) {
        return null;
    }
    const clipboardData = (event as ClipboardEvent).clipboardData;
    if (!clipboardData) {
        return null;
    }
    const pasteText = clipboardData.getData('text/plain');
    if (!pasteText) {
        return null;
    }
    const target = event.target as HTMLInputElement;
    const currentLength = target.value?.length ?? 0;
    // 粘贴时若有选中文本，会被粘贴内容替换，不占用剩余空间
    const selectedLength = Math.max(
        0,
        (target.selectionEnd ?? 0) - (target.selectionStart ?? 0),
    );
    if (currentLength - selectedLength + pasteText.length > maxlength) {
        return {
            pasteLength: pasteText.length,
            currentLength,
            maxlength,
        };
    }
    return null;
}

/** 判断本次粘贴是否会被原生 maxlength 截断 */
export function isPasteExceed(event: Event, maxlength?: number): boolean {
    return getPasteExceedPayload(event, maxlength) != null;
}

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
