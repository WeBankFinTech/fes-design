export type CascaderNodeValue = string | number;
export type CascaderNodePathValue = CascaderNodeValue[];

export interface CascaderOption extends Record<string, unknown> {
    label?: string;
    value?: CascaderNodeValue;
    children?: CascaderOption[];
    disabled?: boolean;
    leaf?: boolean;
}

export interface Node {
    checked: boolean;
    indeterminate: boolean;
    data: [];
    parent?: Node;
    nodeId: string;
    level: number;
    value: number | string | boolean;
    label: string;
    pathNodes: Node[];
    pathValues: CascaderNodePathValue;
    pathLabels: string[];
    childrenData: CascaderOption[] | undefined;
    children: Node[];
    isDisabled: boolean;
    isLeaf: boolean;
    elem: HTMLElement | null;
}
