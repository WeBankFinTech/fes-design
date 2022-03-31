import type { SelectProps } from '../select/props';
import type { CascaderPanelProps } from '../cascader-panel/props';
import { computed, Ref } from 'vue';
import { CascaderNode, OptionValue } from '../cascader-panel/interface';
import { getNodeValueByCurrentValue } from '../cascader-panel/utils';

export type NoMatchedNodesType = {
    value: OptionValue;
    label: string;
    pathLabels: string[];
    pathNodes: [];
};

export function useNoMatchedNodes(
    props: SelectProps & CascaderPanelProps,
    currentValue: Ref<OptionValue | OptionValue[]>,
    selectedNodes: Ref<CascaderNode[]>,
) {
    // 兼容没有匹配到节点情况
    const noMatchedNodes = computed(() => {
        const nodes: NoMatchedNodesType[] = [];
        const { nodeConfig, multiple } = props;

        const nodeValue = getNodeValueByCurrentValue(
            multiple,
            nodeConfig.emitPath,
            currentValue.value,
        );

        const pushNodesByValue = (value: OptionValue) => {
            if (
                value &&
                !selectedNodes.value.find((node) => node.value === value)
            ) {
                const label = `${value}`;
                nodes.push({
                    value,
                    label,
                    pathLabels: [label],
                    pathNodes: [],
                });
            }
        };

        if (multiple) {
            (nodeValue as OptionValue[]).forEach((value) => {
                pushNodesByValue(value);
            });
        } else {
            pushNodesByValue(nodeValue as OptionValue);
        }

        return nodes;
    });

    return {
        noMatchedNodes,
    };
}
