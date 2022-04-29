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
    emptyText: {
        type: String,
    },
    expandedKeys: {
        type: Array as PropType<CascaderNodeKey[]>,
        default(): CascaderNodeKey[] {
            return [];
        },
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
        default: true,
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

export const CASCADER_PROVIDE_KEY: InjectionKey<CascaderInst> =
    Symbol('FCascader');
