import type { VNodeChild } from 'vue';

export type CascaderNodeKey = string | number;

export interface CascaderOption {
    value: CascaderNodeKey;
    label: string;
    children?: CascaderOption[];
    disabled?: boolean;
    selectable?: boolean;
    checkable?: boolean;
    isLeaf?: boolean;
    prefix?: string | (() => VNodeChild);
    suffix?: string | (() => VNodeChild);
    [key: string]: any;
}

export interface InnerCascaderOption extends CascaderOption {
    origin?: CascaderOption;
    level?: number;
    hasChildren?: boolean;
    indexPath?: CascaderNodeKey[];
    children?: InnerCascaderOption[];
    childrenValues?: CascaderNodeKey[];
    isExpanded?: boolean;
}

export interface CascaderNodeList {
    [key: string]: InnerCascaderOption;
}

interface CascaderEventParams {
    node: CascaderOption;
    event: Event;
    selected: boolean;
}

export interface SelectParams extends CascaderEventParams {
    selectedKeys: CascaderNodeKey[];
}

export interface CheckParams extends CascaderEventParams {
    checkedKeys: CascaderNodeKey[];
}
