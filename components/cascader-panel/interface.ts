import { EXPAND_TRIGGER } from './const';

export type CascaderNodeValue = string | number;
export type CascaderNodePathValue = CascaderNodeValue[];

export interface CascaderOption extends Record<string, unknown> {
    label?: string;
    value?: CascaderNodeValue;
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
    value?: CascaderNodeValue;
    label?: string;
    children?: CascaderOption[];
    disabled?: boolean;
}
export interface CascaderNode {
    checked: boolean;
    indeterminate: boolean;
    data: NodeOption;
    parent?: CascaderNode;
    nodeId: string;
    level: number;
    value: CascaderNodeValue;
    label: string;
    pathNodes: CascaderNode[];
    pathValues: CascaderNodePathValue;
    pathLabels: string[];
    childrenData: CascaderOption[] | undefined;
    children: CascaderNode[];
    isDisabled: boolean;
    isLeaf: boolean;
    elem: HTMLElement | null;
}

export type CascaderPanelEmits = {
    (e: 'expandChange', value: CascaderNodeValue[]): void;
    (e: 'checkChange', value: CascaderNodeValue | CascaderNodeValue[]): void;
    (e: 'close'): void;
};
