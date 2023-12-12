import type { InjectionKey, PropType, Ref, ComputedRef } from 'vue';

export const COMPONENT_NAME = 'FCollapse';

export const definePropType = <T>(val: any): PropType<T> => val;

export const generateId = (): number => Math.floor(Math.random() * 10000);

export type CollapseActiveName = string | number;

export type contextType = {
    activeNames: Ref<(string | number)[]>;
    handleItemClick: (name: CollapseActiveName) => void;
};

export type ArrowType = {
    arrow: ComputedRef<string>;
    embedded: ComputedRef<boolean>;
};

export const collapseContextKey: InjectionKey<contextType> =
    Symbol('collapseContextKey');

export const arrowPositionKey: InjectionKey<ArrowType> =
    Symbol('arrow_position');
