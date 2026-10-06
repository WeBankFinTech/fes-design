import { type ComputedRef, type InjectionKey, type PropType, type Ref, useId } from 'vue';

export const COMPONENT_NAME = 'FCollapse';

export const definePropType = <T>(val: any): PropType<T> => val;

// 确定性 ID：useId() 基于组件树位置，SSR 与客户端水合产出相同值。
// （旧实现 Math.random() 导致服务端/客户端两次渲染 id 不同 →
// id/aria-* 属性水合不一致告警）
export const generateId = (): string => useId();

export type CollapseActiveName = string | number;

export interface contextType {
    activeNames: Ref<(string | number)[]>;
    handleItemClick: (name: CollapseActiveName) => void;
}

export interface ArrowType {
    arrow: ComputedRef<string>;
    embedded: ComputedRef<boolean>;
}

export const collapseContextKey: InjectionKey<contextType>
    = Symbol('collapseContextKey');

export const arrowPositionKey: InjectionKey<ArrowType>
    = Symbol('arrow_position');
