import type {
    CSSProperties,
    ComponentInternalInstance,
    ComputedRef,
    Ref,
    SetupContext,
} from 'vue';
import type { DescriptionsItemProps } from './props';

export type LabelAlign = 'center' | 'left' | 'right';
export type LabelPlacement = 'top' | 'left';

export interface DescriptionsItemInst {
    id: ComponentInternalInstance['uid'];
    index: number;
    props: DescriptionsItemProps;
    slots: SetupContext['slots'];
}

export interface DescriptionsProvide {
    parentProps: ComputedRef<{
        column: number;
        contentStyle: CSSProperties | string;
        labelAlign: LabelAlign;
        labelPlacement: LabelPlacement;
        labelStyle: CSSProperties | string;
        separator: string;
        bordered: boolean;
    }>;
    items: Ref<DescriptionsItemInst[]>;
    addItem: (item: DescriptionsItemInst) => void;
    removeItem: (id: DescriptionsItemInst['id']) => void;
}
