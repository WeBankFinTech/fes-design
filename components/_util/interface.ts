import type {
    App,
    DefineComponent,
    ExtractPropTypes,
    InjectionKey,
    ObjectDirective,
    Plugin,
    Ref,
    SetupContext,
    SlotsType,
} from 'vue';
import type { RemoveReadonly } from './types';

export type Emit = SetupContext['emit'];

export type BooleanRef = Ref<boolean>;

export type FObjectDirective = ObjectDirective & {
    name: string;
};

export type VModelEvent = 'update:modelValue';
export type ChangeEvent = 'change';

export type UpdateCurrentValue = (val: any) => void;
export type FormValidate = (eventName: string) => void;

export type ComponentInstall = DefineComponent & {
    install: (app: App) => void;
} & {
    [key: string]: DefineComponent;
};

export type GetContainer = () => HTMLElement;

export type SFCWithInstall<T> = T & Plugin;

export type UnboxInjection<Key extends InjectionKey<unknown>> =
    Key extends InjectionKey<infer I> ? I : never;

export type ExtractPublicPropTypes<T> = Omit<
    Partial<RemoveReadonly<ExtractPropTypes<T>>>,
    Extract<keyof T, `internal${string}`>
>;

/** defineComponent 中 setup 函数的 props 参数类型 */
export type ComponentInnerProps<P> = Parameters<DefineComponent<P>['setup']>[0];

/** defineComponent 中 setup 函数的 slots 参数类型 */
export type ComponentSlots<SlotParams extends Record<string, unknown>> =
    SetupContext<unknown, SlotsType<SlotParams>>['slots'];

/** defineComponent 中 setup 函数的 emit 参数类型 */
export type ComponentEmit<EmitEvents extends readonly string[]> = (
    event: EmitEvents[number],
    ...args: any[]
) => void;

export interface Option {
    value?: string | number | boolean;
    label?: string | number;
    disabled?: boolean;
}
