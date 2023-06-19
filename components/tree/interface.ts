import type { VNodeChild, Ref } from 'vue';

export type TreeNodeKey = string | number;

export interface TreeOption {
    value: TreeNodeKey;
    label: string;
    children?: TreeOption[];
    disabled?: boolean;
    selectable?: boolean;
    checkable?: boolean;
    draggable?: boolean;
    isLeaf?: boolean;
    prefix?: string | (() => VNodeChild);
    suffix?: string | (() => VNodeChild);
    [key: string]: any;
}

export interface InnerTreeOption extends TreeOption {
    origin?: TreeOption;
    level?: number;
    hasChildren?: boolean;
    indexPath?: TreeNodeKey[];
    childrenPath?: TreeNodeKey[];
    children?: InnerTreeOption[];
    isExpanded?: Ref<boolean>;
    isChecked?: Ref<boolean>;
    isIndeterminate?: Ref<boolean>;
}

interface TreeEventParams {
    node: TreeOption;
    event: Event;
    selected: boolean;
}

export interface SelectParams extends TreeEventParams {
    selectedKeys: TreeNodeKey[];
}

export interface CheckParams extends TreeEventParams {
    checkedKeys: TreeNodeKey[];
}

export type DropPosition = 'before' | 'inside' | 'after';
