import { isArray, isBoolean, isEmpty } from 'lodash-es';
import type {
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

export type CascaderNode = Node;

export class Node {
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
        readonly root = false,
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

        this.children = (childrenData || []).map(
            (child: NodeOption) => new Node(child, config, props, this),
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

    get isChildLoaded(): boolean {
        return this.loaded && this.children.every((node) => node.isChildLoaded);
    }

    get isNeedLazyLoad(): boolean {
        return !this.loaded || !this.isChildLoaded;
    }

    // 挂载子节点
    appendChild(childData: CascaderOption) {
        const { childrenData, children, config, props } = this;
        const node = new Node(childData, config, props, this);

        if (Array.isArray(childrenData)) {
            childrenData.push(childData);
        } else {
            this.childrenData = [childData];
        }

        children.push(node);

        return node;
    }
}