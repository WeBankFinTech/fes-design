import type { Option, VModelEvent, ChangeEvent } from '../_util/interface';

export type OptionValue = Option['value'];

export type CheckboxGroupEmits = {
    (e: VModelEvent, value: OptionValue[]): void;
    (e: ChangeEvent, value: OptionValue[]): void;
};
