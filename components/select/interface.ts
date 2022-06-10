import type { ToRefs, VNodeChild, Ref } from 'vue';
import type { OptionProps } from './option';

export type SelectValue = string | number | boolean | object;

export interface SelectOption {
    value: string | number | boolean | object;
    label: string | number;
    disabled?: boolean;
}

export interface OptionChildren extends ToRefs<OptionProps> {
    id: number;
    slots: {
        [key: string]: () => VNodeChild;
    };
    label: Ref<string>;
}
