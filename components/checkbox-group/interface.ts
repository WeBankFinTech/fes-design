import type { VModelEvent, ChangeEvent } from '../_util/interface';

export interface CheckboxGroupProps {
    modelValue: [];
    vertical?: boolean;
    disabled?: boolean;
}

export type CheckboxGroupEmits = {
    (e: VModelEvent, value: string | number | boolean): void;
    (e: ChangeEvent, value: string | number | boolean): void;
};
