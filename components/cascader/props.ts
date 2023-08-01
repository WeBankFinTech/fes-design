import { extractPropsDefaultValue } from '../_util/utils';
import { CHECK_STRATEGY, EXPAND_TRIGGER } from './const';
import type { PropType, InjectionKey, Ref } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';
import type {
    CascaderOption,
    CascaderNodeKey,
    InnerCascaderOption,
    CascaderNodeList,
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
        type: String as PropType<
            (typeof CHECK_STRATEGY)[keyof typeof CHECK_STRATEGY]
        >,
        default: CHECK_STRATEGY.CHILD,
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
        type: Function as PropType<
            (node: null | CascaderOption) => Promise<CascaderOption[]>
        >,
    },
    cancelable: {
        type: Boolean,
        default: true,
    },
    expandTrigger: {
        type: String,
        default: EXPAND_TRIGGER.CLICK,
    },
    emitPath: {
        type: Boolean,
        default: false,
    },
    initLoadKeys: {
        type: Array as PropType<CascaderNodeKey[]>,
        default(): CascaderNodeKey[] {
            return [];
        },
    },
    showPath: {
        type: Boolean,
        default: false,
    },
    isOpened: {
        type: Boolean,
        default: true,
    },
} as const;

export type CascaderProps = ExtractPublicPropTypes<typeof cascaderProps>;

export const cascaderPropsDefaultValue =
    extractPropsDefaultValue(cascaderProps);

export interface CascaderInst {
    props: CascaderProps;
    selectNode: (value: CascaderNodeKey, event: Event) => void;
    expandNode: (value: CascaderNodeKey, event: Event) => void;
    checkNode: (value: CascaderNodeKey, event: Event) => void;
    hasSelected: (value: CascaderNodeKey) => boolean;
    hasChecked: (value: CascaderNodeKey) => boolean;
    hasLoaded: (node: InnerCascaderOption) => boolean;
    hasCheckLoaded: (
        value: CascaderNodeKey,
        nodeList: CascaderNodeList,
    ) => boolean;
    hasActive: (value: CascaderNodeKey, nodeList: CascaderNodeList) => boolean;
    transformData: Ref<CascaderNodeKey[]>;
    nodeList: {
        [key: string]: InnerCascaderOption;
    };
}

export const CASCADER_PROVIDE_KEY: InjectionKey<CascaderInst> =
    Symbol('FCascader');
