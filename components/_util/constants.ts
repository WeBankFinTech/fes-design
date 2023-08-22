import type { InjectionKey } from 'vue';
import type { FormItemInject } from '../form/interface';

export const UPDATE_MODEL_EVENT = 'update:modelValue';

export const CHANGE_EVENT = 'change';

export const CLOSE_EVENT = 'close';

export const OK_EVENT = 'ok' as const;

export const CANCEL_EVENT = 'cancel' as const;

export const ERROR_EVENT = 'error';

export const LOAD_EVENT = 'load';

export const PLACEMENT = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'right',
    'right-start',
    'right-end',
    'left',
    'left-start',
    'left-end',
] as const;

export const TRIGGER = ['click', 'hover', 'focus', 'contextmenu'] as const;

export const FORM_ITEM_INJECTION_KEY: InjectionKey<FormItemInject> =
    Symbol('FFormItemKey');

export const TO_TOP_EVENT = 'toTop';
export const TO_BOTTOM_EVENT = 'toBottom';
export const RESIZED_EVENT = 'resized';
