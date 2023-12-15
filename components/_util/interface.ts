import type {
    ObjectDirective,
    SetupContext,
    Ref,
    DefineComponent,
    App,
    Plugin,
    ExtractPropTypes,
} from 'vue';

export type Emit = SetupContext['emit'];

export type BooleanRef = Ref<boolean>;

export type FObjectDirective = ObjectDirective & {
    name: string;
};

export type VModelEvent = 'update:modelValue';
export type ChangeEvent = 'change';
export type CLOSE_EVENT = 'close';
export type LOAD_EVENT = 'close';

export type UpdateCurrentValue = (val: any) => void;
export type FormValidate = (eventName: string) => void;

export type ComponentInstall = DefineComponent & {
    install: (app: App) => void;
} & {
    [key: string]: DefineComponent;
};

export type GetContainer = () => HTMLElement;

export type SFCWithInstall<T> = T & Plugin;

type RemoveReadonly<T> = {
    -readonly [key in keyof T]: T[key];
};

export type ExtractPublicPropTypes<T> = Omit<
    Partial<RemoveReadonly<ExtractPropTypes<T>>>,
    Extract<keyof T, `internal${string}`>
>;

export interface Option {
    value?: string | number | boolean;
    label?: string | number;
    disabled?: boolean;
}

/**
 * 将多个数组类型的联合类型，转换成数组成员类型为各数组成员的数组
 *
 * @example
 * ```ts
 * type Result = ArrayUnionToUnionArray<string[] | number[]>;
 * type Result = (string | number)[];
 * ```
 */
export type ArrayUnionToUnionArray<U> = (U extends (infer I)[] ? I : never)[];
