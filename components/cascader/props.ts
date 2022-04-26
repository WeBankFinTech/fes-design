import type { ExtractPropTypes, PropType, InjectionKey } from 'vue';
import { CHECK_STRATEGY } from './const';
import { extractPropsDefaultValue } from '../_util/utils';

import type {
    CascaderOption,
    CascaderNodeKey,
    InnerCascaderOption,
} from './interface';

export const cascaderProps = {
    data: {
        type: Array as PropType<CascaderOption[]>,
        default(): CascaderOption[] {
            return [];
        },
    },
    defaultExpandAll: {
        type: Boolean,
        default: false,
    },
    expandedKeys: {
        type: Array as PropType<CascaderNodeKey[]>,
        default(): CascaderNodeKey[] {
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
        type: Array as PropType<CascaderNodeKey[]>,
        default(): CascaderNodeKey[] {
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
        type: Array as PropType<CascaderNodeKey[]>,
        default(): CascaderNodeKey[] {
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
        type: Function as PropType<(node: CascaderOption) => Promise<any>>,
    },
    filterMethod: {
        type: Function as PropType<
            (filterText: string, node: CascaderOption) => boolean
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

export const cascaderPropsDefaultValue =
    extractPropsDefaultValue(cascaderProps);

export type CascaderProps = Partial<ExtractPropTypes<typeof cascaderProps>>;

export interface CascaderInst {
    props: CascaderProps;
    selectNode: (value: CascaderNodeKey, event: Event) => void;
    expandNode: (value: CascaderNodeKey, event: Event) => void;
    checkNode: (value: CascaderNodeKey, event: Event) => void;
    hasSelected: (value: CascaderNodeKey) => boolean;
    hasChecked: (value: CascaderNodeKey) => boolean;
    hasIndeterminate: (node: InnerCascaderOption) => boolean;
    nodeList: {
        [key: string]: InnerCascaderOption;
    };
}

export const CASCADER_PROVIDE_KEY: InjectionKey<CascaderInst> = Symbol('FCascader');
