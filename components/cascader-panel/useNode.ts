import { ref, computed, watch, Ref } from 'vue';
import { getNodeByValue, getNodeValueByCurrentValue, flatNodes } from './utils';
import { getNode } from './node';

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
                getNode(nodeData, config.value, props, null),
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

        const nodeValue = getNodeValueByCurrentValue(
            multiple,
            emitPath,
            currentValue as OptionValue | OptionValue[],
        );

        // 单选
        if (!multiple) {
            const node = getNodeByValue(
                allNodes.value,
                nodeValue as OptionValue,
            );

            if (node) {
                currentSelectedNodes.push(node);
            }
        } else {
            // 多选
            allNodes.value.forEach((item) => {
                if ((nodeValue as OptionValue[]).includes(item.value)) {
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
