import { ref, computed, watch, Ref } from 'vue';
import { getNodeByValue, getNodeValueByCurrentValue, flatNodes } from './utils';
import { Node } from './getNode';

import type {
    CascaderNodeConfig,
    CascaderMenu,
    OptionValue,
    CascaderOption,
} from './interface';
import type { CascaderNode } from './getNode';

import type { CascaderPanelProps } from './props';
import { isEmpty, isFunction, cloneDeep, isArray } from 'lodash-es';

function useNodesAndMenu(
    config: Ref<CascaderNodeConfig>,
    props: CascaderPanelProps,
) {
    const nodes = ref<CascaderNode[]>([]);
    const menus = ref<CascaderMenu[]>([]);
    const initialLoaded = ref(true);

    const allNodes = computed(() => flatNodes(nodes.value));
    const leafNodes = computed(() => flatNodes(nodes.value, true));

    function _appendNode(nodeData: CascaderOption, parentNode?: CascaderNode) {
        // 兼容初始加载的情况
        if (!parentNode) {
            nodes.value.push(new Node(nodeData, config.value, props, null));
        } else {
            parentNode.appendChild(nodeData);
        }
    }

    function _appendNodes(
        nodeDataList: CascaderOption[],
        parentNode?: CascaderNode,
    ) {
        nodeDataList.forEach((nodeData) => _appendNode(nodeData, parentNode));
    }

    const handleLoadNode = async (node: CascaderNode) => {
        const { loadData } = props;
        if (!isFunction(loadData)) {
            throw new Error('remote 模式下，loadData 不可为空');
        }

        const parent = node.root ? null : node;

        node.loading = true;
        const childrenData = await loadData(
            parent ? cloneDeep(parent.data) : null,
        );
        node.loading = false;
        node.loaded = true;

        // 挂载子节点列表
        if (isArray(childrenData)) {
            _appendNodes(childrenData as CascaderOption[], parent);
        } else {
            console.error(
                '返回子节点数据格式异常 || childrenData:',
                childrenData,
            );
        }
    };

    // 初始化节点列表和菜单
    const initNodesAndMenu = async () => {
        nodes.value = (props.options || []).map(
            (nodeData) => new Node(nodeData, config.value, props, null),
        );
        menus.value = [
            {
                nodes: nodes.value,
                menuId: `menuId_root`, // 根菜单，固定即可
            },
        ];

        // 若为异步加载且初始选项为空
        if (props.remote && isEmpty(props.options)) {
            initialLoaded.value = false;

            await handleLoadNode(new Node({}, config.value, props, null, true));
            menus.value = [
                {
                    nodes: nodes.value,
                    menuId: `menuId_root`, // 根菜单，固定即可
                },
            ];

            initialLoaded.value = true;
        }
    };

    watch(
        [() => config.value, () => props.options],
        () => {
            initNodesAndMenu();
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
        handleLoadNode,
        initialLoaded,
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
    // 若节点列表更新，则节点选中状态也根据 currentValue 更新
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
    const {
        nodes,
        menus,
        allNodes,
        leafNodes,
        updateMenus,
        handleLoadNode,
        initialLoaded,
    } = useNodesAndMenu(config, props);

    const { selectedNodes } = useSelectedNodes(config, props, allNodes);

    return {
        nodes,
        menus,
        allNodes,
        leafNodes,
        setNodeElem,
        selectedNodes,
        updateMenus,
        handleLoadNode,
        initialLoaded,
    };
};
