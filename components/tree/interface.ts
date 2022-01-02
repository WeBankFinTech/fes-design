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
}

export interface InnerTreeOption extends TreeOption {
    origin?: TreeOption;
    level?: number;
    hasChildren?: boolean;
    indexPath?: TreeNodeKey[];
    children?: InnerTreeOption[];
    isExpanded?: boolean;
}
