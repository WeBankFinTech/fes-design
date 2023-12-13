import { type OptionValue } from './const';
import type { VModelEvent, ChangeEvent } from '../_util/interface';

export type CheckboxGroupEmits = {
    (e: VModelEvent, value: OptionValue[]): void;
    (e: ChangeEvent, value: OptionValue[]): void;
};
