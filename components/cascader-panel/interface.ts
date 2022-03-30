import { EXPAND_TRIGGER } from './const';

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
export interface CascaderNode {
    checked: boolean;
    indeterminate: boolean;
    data: NodeOption;
    parent?: CascaderNode;
    nodeId: string;
    level: number;
    value: OptionValue;
    label: string;
    pathNodes: CascaderNode[];
    pathValues: CascaderNodePathValue;
    pathLabels: string[];
    childrenData: CascaderOption[] | undefined;
    children: CascaderNode[];
    isDisabled: boolean;
    isLeaf: boolean;
    elem: HTMLElement | null;
    loaded: boolean;
    loading: boolean;
}

export interface CascaderMenu {
    nodes: CascaderNode[];
    menuId: string;
}

export type CascaderPanelEmits = {
    (e: 'expandChange', value: OptionValue[]): void;
    (e: 'checkChange', value: OptionValue | OptionValue[]): void;
    (e: 'close'): void;
};
