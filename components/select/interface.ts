import type { ToRefs, VNodeChild, Ref } from 'vue';
import type { OptionProps } from './option';

export type SelectValue = string | number | boolean | object;

export interface SelectOption {
    value: string | number | boolean | object;
    label: string | number;
    disabled?: boolean;
    __cache?: boolean;
}
// export interface BaseOption {
//     disabled?: boolean;
//     __cache?: boolean;
// }

// interface DefaultSelectOption extends BaseOption {
//     value: string | number | boolean | object;
//     label: string | number;
// }

// type CustomSelectOption<
//     T extends string | number | symbol,
//     U extends string | number | symbol,
// > = BaseOption &
//     Record<T, string | number | boolean | object> &
//     Record<U, string | number>;

// export type SelectOption<
//     T extends string | number | symbol | undefined = undefined,
//     U extends string | number | symbol | undefined = undefined,
// > = T extends string | number | symbol
//     ? U extends string | number | symbol
//         ? CustomSelectOption<T, U>
//         : never
//     : DefaultSelectOption;

export interface OptionChildren extends ToRefs<OptionProps> {
    id: number;
    slots: {
        [key: string]: () => VNodeChild;
    };
    label: Ref<string>;
}
