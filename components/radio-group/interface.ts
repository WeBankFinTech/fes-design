import type { VModelEvent, ChangeEvent } from '../_util/interface';

export type RadioGroupEmits = {
    (e: VModelEvent, value: string | number | boolean): void;
    (e: ChangeEvent, value: string | number | boolean): void;
};

export type Size = 'small' | 'middle';

export type Type = 'default' | 'primary';

export type OptionType = 'default' | 'button';
