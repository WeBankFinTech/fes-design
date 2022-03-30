import { ref, computed, watch, Ref } from 'vue';
import { flatNodes } from '../_util/utils';
import {
    getMultiNodeValuesByCurrentValue,
    getNode,
    getNodeByValue,
    getNodeValueByCurrentValue,
} from './utils';

import type {
    CascaderNode,
    CascaderNodeConfig,
    CascaderMenu,
    OptionValue,
} from './interface';
import type { CascaderPanelProps } from './props';

function useNodes(config: Ref<CascaderNodeConfig>, props: CascaderPanelProps) {
    const nodes = ref<CascaderNode[]>([]);
    const menus = ref<CascaderMenu[]>([]);

    const allNodes = computed(() => flatNodes(nodes.value));
    const leafNodes = computed(() => flatNodes(nodes.value, true));

    watch(
        [() => config.value, () => props.options],
        () => {
            nodes.value = (props.options || []).map((nodeData) =>
                getNode(nodeData, config.value),
            );
            menus.value = [
                {
                    nodes: nodes.value,
                    menuId: `menuId_root`, // 根菜单，固定即可
                },
            ];
        },
        {
            deep: true,
            immediate: true,
        },
    );

    const updateMenus = (currentMenus: CascaderMenu[]) => {
        menus.value = currentMenus;
    };

    return {
        nodes,
        menus,
        allNodes,
        leafNodes,
        updateMenus,
    };
}

function setNodeElem(node: CascaderNode, elem: HTMLElement) {
    node.elem = elem;
}

function useSelectedNodes(
    config: Ref<CascaderNodeConfig>,
    props: CascaderPanelProps,
    allNodes: Ref<CascaderNode[]>,
) {
    const selectedNodes = computed(() => {
        const { emitPath } = config.value;
        const { currentValue, multiple } = props;
        const currentSelectedNodes = [];

        /**
         * 单选
         */
        if (!multiple) {
            const nodeValue = getNodeValueByCurrentValue(
                emitPath,
                currentValue as OptionValue,
            );

            const node = getNodeByValue(allNodes.value, nodeValue);

            if (node) {
                currentSelectedNodes.push(node);
            }
        } else {
            /**
             * 多选
             */
            const nodeValues = getMultiNodeValuesByCurrentValue(
                emitPath,
                currentValue as OptionValue[],
            );
            allNodes.value.forEach((item) => {
                if (nodeValues.includes(item.value)) {
                    currentSelectedNodes.push(item);
                }
            });
        }

        return currentSelectedNodes;
    });

    return {
        selectedNodes,
    };
}

export default (config: Ref<CascaderNodeConfig>, props: CascaderPanelProps) => {
    const { nodes, menus, allNodes, leafNodes, updateMenus } = useNodes(
        config,
        props,
    );

    const { selectedNodes } = useSelectedNodes(config, props, allNodes);

    return {
        nodes,
        menus,
        allNodes,
        leafNodes,
        setNodeElem,
        selectedNodes,
        updateMenus,
    };
};
