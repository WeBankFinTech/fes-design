import { cloneDeep } from 'lodash-es';
import { Ref } from 'vue';
import type { OptionValue } from '../cascader-panel/interface';
import type { CascaderNode } from '../cascader-panel/getNode';

import type { CascaderPanelProps } from '../cascader-panel/props';
import { SelectOptionValue } from '../select-trigger/interface';
import { SelectProps } from '../select/props';
import { flatNodes } from '../cascader-panel/utils';
import type { SelectValue, CascaderEmits } from './interface';
import type { NoMatchedNodesType } from './useNoMatchedNodes';

/**
 * 多选才会有删除事件，所有仅考虑数组情况即可
 *
 * 若为 checkStrictly = all 情况，则：
 * 1. 若删除的为父节点，需要把子节点的值一起删除
 * 2. 若删除的为子节点，需要把父节点的值一起删除
 */
export function useMultiRemove(
    props: SelectProps & CascaderPanelProps,
    currentValue: Ref<OptionValue[]>,
    selectedNodes: Ref<CascaderNode[]>,
    noMatchedNodes: Ref<NoMatchedNodesType[]>,
    updateCurrentValue: (val: SelectOptionValue[]) => void,
    emit: CascaderEmits,
    handleChange: () => void,
) {
    const handleRemove = (value: SelectValue) => {
        if (props.disabled) return;

        const { emitPath } = props.nodeConfig;
        const copyValue = cloneDeep(currentValue.value);
        const updateValues: SelectOptionValue[] = [];
        let removeValues: SelectOptionValue[] = [];

        const currentNode = selectedNodes.value.find(
            (node) => node.value === value,
        );
        // 兼容没有匹配到节点情况的处理
        if (currentNode) {
            removeValues = []
                .concat(currentNode.pathNodes, flatNodes(currentNode.children))
                .map((node) => node.value);
        } else {
            const currentNoMatchedNode = noMatchedNodes.value.find(
                (node) => node.value === value,
            );
            if (currentNoMatchedNode) {
                removeValues = [currentNoMatchedNode.value];
            }
        }

        copyValue.forEach((item: OptionValue | OptionValue[]) => {
            let itemValue: OptionValue = item as OptionValue;
            if (emitPath) {
                itemValue = (item as OptionValue[])[
                    (item as OptionValue[]).length - 1
                ];
            }
            if (!removeValues.includes(itemValue)) {
                updateValues.push(item);
            }
        });

        updateCurrentValue(updateValues);
        emit('removeTag', value as OptionValue);
        handleChange();
    };

    return {
        handleRemove,
    };
}
