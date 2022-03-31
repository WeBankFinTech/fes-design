import type { OptionValue } from '../cascader-panel/interface';

export type SelectValue = OptionValue | OptionValue[] | OptionValue[][];

export type CascaderEmits = {
    (e: 'removeTag', value: OptionValue): void;
};
