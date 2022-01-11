import type { VModelEvent, ChangeEvent } from '../_util/interface';

export type RadioGroupProps = {
    modelValue?: string | number | boolean;
    vertical?: boolean;
    disabled?: boolean;
};

export type RadioGroupEmits = {
    (e: VModelEvent, value: string | number | boolean): void;
    (e: ChangeEvent, value: string | number | boolean): void;
};
