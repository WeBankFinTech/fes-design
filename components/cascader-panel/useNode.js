import { ref, computed, watch } from 'vue';
import { flatNodes } from '../_util/utils';
import {
    generateId,
    getMultiNodeValuesByCurrentValue,
    getNode,
    getNodeByValue,
    getNodeValueByCurrentValue,
} from './utils';

function useNodes(config, props) {
    const nodes = ref([]);
    const menus = ref([]);

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
                    menuId: `${generateId()}`, // 随机生成 menuId，以便重新渲染
                },
            ];
        },
        {
            deep: true,
            immediate: true,
        },
    );

    const updateMenus = (currentMenus) => {
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

function setNodeElem(node, elem) {
    node.elem = elem;
}

function useSelectedNodes(config, props, allNodes) {
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
                currentValue,
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
                currentValue,
            );
            nodeValues.forEach((nodeValue) => {
                const node = getNodeByValue(allNodes.value, nodeValue);
                if (node) {
                    currentSelectedNodes.push(node);
                }
            });
        }

        return currentSelectedNodes;
    });

    return {
        selectedNodes,
    };
}

export default (config, props) => {
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
