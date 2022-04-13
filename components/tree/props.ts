import type { ExtractPropTypes, PropType, InjectionKey } from 'vue';
import { CHECK_STRATEGY } from './const';
import { extractPropsDefaultValue } from '../_util/utils';

import type { TreeOption, TreeNodeKey, InnerTreeOption } from './interface';

export const treeProps = {
    data: {
        type: Array as PropType<TreeOption[]>,
        default(): TreeOption[] {
            return [];
        },
    },
    defaultExpandAll: {
        type: Boolean,
        default: false,
    },
    expandedKeys: {
        type: Array as PropType<TreeNodeKey[]>,
        default(): TreeNodeKey[] {
            return [];
        },
    },
    accordion: {
        type: Boolean,
        default: false,
    },
    selectable: {
        type: Boolean,
        default: true,
    },
    selectedKeys: {
        type: Array as PropType<TreeNodeKey[]>,
        default(): TreeNodeKey[] {
            return [];
        },
    },
    cascade: {
        type: Boolean,
        default: false,
    },
    checkable: {
        type: Boolean,
        default: false,
    },
    checkStrictly: {
        type: String as PropType<CHECK_STRATEGY>,
        default: 'all',
    },
    checkedKeys: {
        type: Array as PropType<TreeNodeKey[]>,
        default(): TreeNodeKey[] {
            return [];
        },
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    childrenField: {
        type: String,
        default: 'children',
    },
    valueField: {
        type: String,
        default: 'value',
    },
    labelField: {
        type: String,
        default: 'label',
    },
    remote: {
        type: Boolean,
        default: false,
    },
    loadData: {
        type: Function as PropType<(node: TreeOption) => Promise<any>>,
    },
    filterMethod: {
        type: Function as PropType<
            (filterText: string, node: TreeOption) => boolean
        >,
    },
    inline: {
        type: Boolean,
        default: false,
    },
    virtualList: {
        type: Boolean,
        default: false,
    },
    cancelable: {
        type: Boolean,
        default: true,
    },
} as const;

export const treePropsDefaultValue = extractPropsDefaultValue(treeProps);

export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>;

export interface TreeInst {
    props: TreeProps;
    selectNode: (value: TreeNodeKey, event: Event) => void;
    expandNode: (value: TreeNodeKey, event: Event) => void;
    checkNode: (value: TreeNodeKey, event: Event) => void;
    hasSelected: (value: TreeNodeKey) => boolean;
    hasChecked: (value: TreeNodeKey) => boolean;
    hasIndeterminate: (node: InnerTreeOption) => boolean;
    nodeList: {
        [key: string]: InnerTreeOption;
    };
}

export const TREE_PROVIDE_KEY: InjectionKey<TreeInst> = Symbol('FTree');
