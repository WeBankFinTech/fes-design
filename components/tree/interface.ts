import type { VNodeChild } from 'vue';

export type TreeNodeKey = string | number;

export interface TreeOption {
    value: TreeNodeKey;
    label: string;
    children?: TreeOption[];
    disabled?: boolean;
    selectable?: boolean;
    checkable?: boolean;
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
    children?: InnerTreeOption[];
    isExpanded?: boolean;
}

export interface TreeNodeList {
    [key: string]: InnerTreeOption;
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
