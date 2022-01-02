import type { ToRefs, VNodeChild, Ref } from 'vue';

export type SelectValue = string | number | boolean | object;

export interface SelectOption {
    value: string | number | boolean | object;
    label: string | number;
    disabled?: boolean;
}

export interface OptionProps {
    value: string | number | boolean | object;
    label?: string;
    disabled?: boolean;
}

export interface OptionChildren extends ToRefs<OptionProps> {
    id: number;
    slots: {
        [key: string]: () => VNodeChild;
    };
    label: Ref<string>;
}
