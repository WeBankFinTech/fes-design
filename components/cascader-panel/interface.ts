import { EXPAND_TRIGGER } from './const';
import type { CascaderNode } from './getNode';

export type Nullable<T> = null | T;

export type OptionValue = string | number;
export type CascaderNodePathValue = OptionValue[];

export interface CascaderOption extends Record<string, unknown> {
    label?: string;
    value?: OptionValue;
    children?: CascaderOption[];
    disabled?: boolean;
    leaf?: boolean;
}

export interface CascaderNodeConfig {
    expandTrigger: EXPAND_TRIGGER;
    emitPath: boolean;
    valueField: string;
    labelField: string;
    childrenField: string;
    disabledField: string;
}

export interface NodeOption {
    value?: OptionValue;
    label?: string;
    children?: CascaderOption[];
    disabled?: boolean;
    isLeaf?: boolean;
}

export interface CascaderMenu {
    nodes: CascaderNode[];
    menuId: string;
}

export type CascaderPanelEmits = {
    (e: 'expandChange', value: OptionValue[]): void;
    (e: 'checkChange', value: OptionValue | OptionValue[]): void;
    (e: 'update:selectedNodes', value: CascaderNode[]): void;
    (e: 'close'): void;
};
