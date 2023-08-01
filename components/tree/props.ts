import { extractPropsDefaultValue } from '../_util/utils';
import { CHECK_STRATEGY } from './const';
import type { PropType, InjectionKey, Ref } from 'vue';

import type { ExtractPublicPropTypes } from '../_util/interface';
import type {
    TreeOption,
    TreeNodeKey,
    InnerTreeOption,
    DropPosition,
} from './interface';

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
        type: String as PropType<
            (typeof CHECK_STRATEGY)[keyof typeof CHECK_STRATEGY]
        >,
        default: CHECK_STRATEGY.ALL,
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
    draggable: {
        type: Boolean,
        default: false,
    },
} as const;

export const treePropsDefaultValue = extractPropsDefaultValue(treeProps);

export type TreeProps = ExtractPublicPropTypes<typeof treeProps>;

export interface TreeInst {
    props: TreeProps;
    selectNode: (value: TreeNodeKey, event: Event) => void;
    expandNode: (value: TreeNodeKey, event: Event) => void;
    checkNode: (value: TreeNodeKey, event: Event) => void;
    hasSelected: (value: TreeNodeKey) => boolean;
    nodeList: Map<TreeNodeKey, InnerTreeOption>;
    handleDragstart: (value: TreeNodeKey, event: DragEvent) => void;
    handleDragenter: (value: TreeNodeKey, event: DragEvent) => void;
    handleDragover: (value: TreeNodeKey, event: DragEvent) => void;
    handleDragleave: (value: TreeNodeKey, event: DragEvent) => void;
    handleDragend: (value: TreeNodeKey, event: DragEvent) => void;
    handleDrop: (value: TreeNodeKey, event: DragEvent) => void;
    dragOverInfo: Ref<{
        node: InnerTreeOption;
        position: DropPosition;
    }>;
}

export const TREE_PROVIDE_KEY: InjectionKey<TreeInst> = Symbol('FTree');
