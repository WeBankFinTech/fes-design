import { isArray, isBoolean, isEmpty } from 'lodash';
import type {
    CascaderNode,
    NodeOption,
    OptionValue,
    Nullable,
    CascaderNodePathValue,
    CascaderOption,
    CascaderNodeConfig,
} from './interface';
import type { CascaderPanelProps } from './props';
import { calculatePathNodes } from './utils';

let nodeId = 0;

export const getNode = (
    data: NodeOption,
    config: CascaderNodeConfig,
    props: CascaderPanelProps,
    parent?: CascaderNode,
): CascaderNode => {
    return new Node(data, config, props, parent);
};

export default class Node {
    readonly nodeId: number = nodeId++;
    readonly level: number;
    readonly value: OptionValue;
    readonly label: string;
    readonly pathNodes: CascaderNode[];
    readonly pathValues: CascaderNodePathValue;
    readonly pathLabels: string[];

    childrenData: Nullable<CascaderOption[]>;
    children: CascaderNode[];
    loaded: boolean;
    loading = false;
    checked = false;
    indeterminate = false;
    elem: Nullable<HTMLElement>;

    constructor(
        readonly data: NodeOption,
        readonly config: CascaderNodeConfig,
        readonly props: CascaderPanelProps,
        readonly parent?: CascaderNode,
    ) {
        const { valueField, labelField, childrenField } = config;

        this.level = parent ? parent.level + 1 : 1;
        this.value = data[valueField as 'value'];
        this.label = data[labelField as 'label'];

        const childrenData = data[childrenField as 'children'];
        this.childrenData = childrenData;

        const pathNodes = calculatePathNodes(this);
        this.pathNodes = pathNodes;
        this.pathValues = pathNodes.map((item) => item.value);
        this.pathLabels = pathNodes.map((item) => item.label);

        this.children = (childrenData || []).map((child: NodeOption) =>
            getNode(child, config, props, this),
        );

        this.loaded = !props.remote || this.isLeaf || !isEmpty(childrenData);
    }

    get isDisabled(): boolean {
        const { data, parent, config } = this;
        const { disabledField } = config;

        return !!data[disabledField as 'disabled'] || parent
            ? !!parent.data[disabledField as 'disabled']
            : false;
    }

    get isLeaf(): boolean {
        const { data, childrenData, props } = this;

        if (props.remote && isBoolean(data.isLeaf)) {
            return data.isLeaf;
        } else {
            return !(isArray(childrenData) && childrenData.length);
        }
    }
}
