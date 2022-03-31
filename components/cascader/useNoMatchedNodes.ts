import type { SelectProps } from '../select/props';
import type { CascaderPanelProps } from '../cascader-panel/props';
import { computed, Ref } from 'vue';
import { CascaderNode, OptionValue } from '../cascader-panel/interface';
import { getSingleNodeValueByCurrentValue } from '../cascader-panel/utils';
import { isArray } from 'lodash';

export type NoMatchedNodesType = {
    value: OptionValue;
    label: string;
    pathLabels: OptionValue[];
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

        if (!currentValue.value) {
            return nodes;
        }

        const pushNodesByValue = (
            nodeValue: OptionValue,
            pathLabels: OptionValue[],
        ) => {
            if (
                nodeValue &&
                !selectedNodes.value.find((node) => node.value === nodeValue)
            ) {
                nodes.push({
                    value: nodeValue,
                    label: `${nodeValue}`,
                    pathLabels,
                });
            }
        };

        // props.showAllLevels 且 nodeConfig.emitPath 情况下，支持不识别的节点路径展示
        const handleNode = (itemValue: OptionValue) => {
            const nodeValue = getSingleNodeValueByCurrentValue(
                nodeConfig.emitPath,
                itemValue as OptionValue,
            );

            const pathLabels = itemValue
                ? nodeConfig.emitPath && isArray(itemValue)
                    ? itemValue
                    : [itemValue]
                : [];

            pushNodesByValue(
                nodeValue as OptionValue,
                pathLabels as OptionValue[],
            );
        };

        // 单选
        if (!multiple) {
            handleNode(currentValue.value as OptionValue);
        } else {
            // 多选
            if (isArray(currentValue.value)) {
                currentValue.value.forEach((itemValue) => {
                    handleNode(itemValue as OptionValue);
                });
            }
        }

        return nodes;
    });

    return {
        noMatchedNodes,
    };
}
