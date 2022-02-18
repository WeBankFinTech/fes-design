import type { Ref } from 'vue';
import type { VModelEvent } from '../_util/interface';

export type InputValue = number | string;
export type InputCurrentValue = Ref<InputValue>;

export type InputEmits = {
    (e: VModelEvent, value: string): void;
    (e: 'change', value: string): void;
    (e: 'input', value: string): void;
    (e: 'keydown', event: KeyboardEvent): void;
    (e: 'blur', event: Event): void;
    (e: 'focus', event: Event): void;
    (e: 'clear'): void;
    (e: 'mouseleave', event: MouseEvent): void;
    (e: 'mouseenter', event: MouseEvent): void;
};
