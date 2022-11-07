import type { InjectionKey } from 'vue';
import type { FormInjectKey } from './interface';

export const provideKey: InjectionKey<FormInjectKey> = Symbol('FForm');

export const FORM_NAME = 'FForm';
export const FORM_ITEM_NAME = 'FFormItem';
export const FORM_LAYOUT = {
    HORIZONTAL: 'horizontal',
    INLINE: 'inline',
} as const;

export const LABEL_POSITION = {
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
} as const;

export const VALIDATE_STATUS = {
    DEFAULT: '',
    ERROR: 'error',
    VALIDATING: 'validating',
    SUCCESS: 'success',
};
export const VALIDATE_MESSAGE_DEFAULT = '';

export const TRIGGER_TYPE_DEFAULT = ''; // 默认 trigger 类型
export const RULE_TYPE_DEFAULT = 'string'; // 默认 rule 的校验类型
