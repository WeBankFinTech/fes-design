import type { ObjectDirective, SetupContext, Ref, Component, App } from 'vue';

export type Emit = SetupContext['emit'];

export type BooleanRef = Ref<boolean>;

export type FObjectDirective = ObjectDirective & {
    name: string;
};

export type UpdateCurrentValue = (val: any) => void;
export type FormValidate = (eventName: string) => void;

export type ComponentInstall = Component & {
    install: (app: App) => void;
} & {
    [key: string]: Component;
};
