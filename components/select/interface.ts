import type { ToRefs, VNodeChild, Ref } from 'vue';
import type { OptionProps } from './option';

export type SelectValue = string | number | boolean | object;

export interface SelectOption {
    value?: string | number | boolean | object;
    label?: string | number;
    disabled?: boolean;
    children?: SelectOption[];
    __cache?: boolean;
    __isGroup?: boolean;
    __level?: number;
    [key: string]: any;
}

export interface OptionChildren extends ToRefs<OptionProps> {
    id: number;
    slots: {
        [key: string]: () => VNodeChild;
    };
    label: Ref<string>;
    disabled?: Ref<boolean>;
    children?: OptionChildren[];
}
