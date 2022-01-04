import type { ExtractPropTypes, PropType, InjectionKey, VNodeChild } from 'vue';
import { SelectValue } from '../cascader/interface';

import { extractPropsDefaultValue } from '../_util/utils';
import { CHECK_STRATEGY } from './const';

import type { CascaderNode, CascaderNodeConfig, NodeOption } from './interface';

export const cascaderPanelProps = {
    currentValue: [Number, String, Array] as PropType<SelectValue>,
    options: {
        type: Array as PropType<NodeOption[]>,
        default: (): NodeOption[] => [],
    },
    multiple: Boolean,
    nodeConfig: {
        type: Object as PropType<CascaderNodeConfig>,
        default: () => ({}),
    },
    renderLabel: Function as PropType<() => VNodeChild>,
    handleUpdateSelectedNodes: Function as PropType<
        (selectedNodes: CascaderNode[]) => void
    >,
    showAllLevels: {
        type: Boolean,
        default: true,
    },
    separator: {
        type: String,
        default: ' / ',
    },
    checkStrictly: {
        type: String as PropType<CHECK_STRATEGY>,
        default: CHECK_STRATEGY.CHILD,
    },
} as const;

export const cascaderPanelPropsDefaultValue =
    extractPropsDefaultValue(cascaderPanelProps);

export type CascaderPanelProps = Partial<
    ExtractPropTypes<typeof cascaderPanelProps>
>;

export interface CascaderPanelInst {
    emptyText: string;
    config: CascaderNodeConfig;
    multiple: boolean;
    isHoverMenu: boolean;
    renderLabelFn: (params: {
        node: CascaderNode;
        data: NodeOption;
    }) => VNodeChild;
    expandingNode: CascaderNode;
    handleExpandNode: (node: CascaderNode, silent?: boolean) => void;
    handleCheckChange: (node: CascaderNode, checked?: boolean) => void;
    setNodeElem: (node: CascaderNode, elem: HTMLElement) => void;
}

export const CASCADER_PANEL_INJECTION_KEY: InjectionKey<CascaderPanelInst> =
    Symbol('CascaderPanel');
