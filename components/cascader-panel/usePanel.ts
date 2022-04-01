import { ref, watch, Ref } from 'vue';
import { CHECK_STRATEGY, EVENT_CODE, EXPAND_TRIGGER } from './const';
import useNode from './useNode';
import {
    updateParentNodesCheckState,
    updateChildNodesCheckState,
    getValueByOption,
    getNodeSibling,
    focusNodeElem,
    getMenuNodeByElem,
    getMenuIndexByElem,
    checkNodeElem,
    getCheckNodesByLeafCheckNodes,
    flatNodes,
} from './utils';

import type {
    CascaderNodeConfig,
    OptionValue,
    CascaderPanelEmits,
    CascaderMenu,
    CascaderOption,
} from './interface';
import type { CascaderNode } from './getNode';

import type { CascaderPanelProps } from './props';
import { cloneDeep, isArray, isFunction } from 'lodash-es';

function useUpdateNodes(
    props: CascaderPanelProps,
    emit: CascaderPanelEmits,
    selectedNodes: Ref<CascaderNode[]>,
    allNodes: Ref<CascaderNode[]>,
) {
    // 清除选中和中间状态
    const clearCheckedNodes = () => {
        allNodes.value.forEach((node) => {
            node.checked = false;
            node.indeterminate = false;
        });
    };

    const doUpdateNodes = () => {
        clearCheckedNodes();

        const { multiple, checkStrictly } = props;

        selectedNodes.value.forEach((node) => {
            node.checked = true;
        });

        /**
         * 多选情况，更新节点选中状态
         * 1. 根据选中节点，更新父节点的中间状态和选中状态
         * 1. 若为 checkStrictly = parent 情况，则需要更新子节点的选中状态
         */
        if (multiple) {
            updateParentNodesCheckState(selectedNodes.value);
            if (checkStrictly === CHECK_STRATEGY.PARENT) {
                updateChildNodesCheckState(selectedNodes.value);
            }
        }
    };

    watch(
        () => selectedNodes.value,
        () => {
            doUpdateNodes();
            emit('update:selectedNodes', selectedNodes.value);
        },
        {
            deep: false, // 避免递归处理
            immediate: true,
        },
    );
}

function useExpandNode(
    menus: Ref<CascaderMenu[]>,
    emit: CascaderPanelEmits,
    updateMenus: (menus: CascaderMenu[]) => void,
) {
    const expandingNode = ref(null);

    const handleExpandNode = (node: CascaderNode, silent = false) => {
        const { level } = node;
        const newMenus = menus.value.slice(0, level);
        let newExpandingNode;

        // 若为叶子节点，则展开节点设置为叶子节点的父节点
        if (node.isLeaf) {
            newExpandingNode = node.pathNodes[level - 2] || null;
        } else {
            // 非叶子节点，则当前节点设置为展开节点
            newExpandingNode = node;
            newMenus.push({
                nodes: node.children,
                menuId: `menuId_${node.nodeId}`, // 以便切换父级节点的时候，展开菜单重新渲染
            });
        }

        // 若有展开节点
        if (
            newExpandingNode &&
            expandingNode.value?.nodeId !== newExpandingNode?.nodeId
        ) {
            expandingNode.value = node;
            updateMenus(newMenus);
            !silent && emit('expandChange', node?.pathValues || []);
        } else if (!newExpandingNode) {
            // 若无展开节点，如第一级就是叶子节点
            expandingNode.value = null;
            updateMenus(newMenus);
        }
    };

    return {
        handleExpandNode,
        expandingNode,
    };
}

function useCheckChange(
    config: Ref<CascaderNodeConfig>,
    props: CascaderPanelProps,
    emit: CascaderPanelEmits,
    selectedNodes: Ref<CascaderNode[]>,
    leafNodes: Ref<CascaderNode[]>,
    allNodes: Ref<CascaderNode[]>,
) {
    const handleCheckChange = (node: CascaderNode, checked: boolean) => {
        if (node.checked === checked) return;
        const { multiple } = props;

        // 单选直接返回值
        if (!multiple) {
            emit('checkChange', getValueByOption(config.value, node));
            emit('close');
        } else {
            /**
             * 多选
             * 解析得到叶子节点列表
             * 1. 解析得到当前节点下所有叶子节点的值的列表
             * 2. 若为选中情况，则遍历子孙节点值，判断当前值是否存在，若不存在，则插入
             * 3. 若为取消选中情况，则遍历子孙节点值，判断当前值是否存在，若存在，则删除
             */
            // 因为 selectedNodes 可能父子节点都有的情况，所以需要做下去重处理
            const leafNodeValues = flatNodes(selectedNodes.value, true).reduce(
                (prev, cur) =>
                    prev.includes(cur.value) ? prev : [...prev, cur.value],
                [],
            );
            // 获取当前节点的子孙节点信息
            const checkNodes = flatNodes([node], true);
            checkNodes.forEach((item) => {
                if (checked) {
                    if (!leafNodeValues.includes(item.value)) {
                        leafNodeValues.push(item.value);
                    }
                } else if (leafNodeValues.includes(item.value)) {
                    leafNodeValues.splice(
                        leafNodeValues.indexOf(item.value),
                        1,
                    );
                }
            });

            // 目前值为最后一级节点值，所以仅需过滤子节点即可
            const sortLeafNodes = leafNodes.value.filter((item) =>
                leafNodeValues.includes(item.value),
            );

            let checkValues: OptionValue[] = [];

            if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                const sortLeafValues = sortLeafNodes.map((item) =>
                    getValueByOption(config.value, item),
                );
                checkValues = sortLeafValues as OptionValue[];
            } else {
                const checkParentNodes = getCheckNodesByLeafCheckNodes(
                    sortLeafNodes,
                    allNodes.value,
                    props.checkStrictly,
                );
                const checkParentValus = checkParentNodes.map((item) =>
                    getValueByOption(config.value, item),
                );

                checkValues = checkParentValus as OptionValue[];
            }

            emit('checkChange', checkValues);
        }
    };

    return {
        handleCheckChange,
    };
}

/**
 * 由于 hover 的时候，容易和 keydown 操作由冲突，所以 hover 不支持自动聚焦元素
 */
function useKeyDown(
    config: Ref<CascaderNodeConfig>,
    emit: CascaderPanelEmits,
    menus: Ref<CascaderMenu[]>,
) {
    const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const code = e.code;
        const isValidKeyDown = () => {
            if (config.value.expandTrigger === EXPAND_TRIGGER.HOVER) {
                return false;
            }
            return true;
        };

        switch (code) {
            /**
             * 1. 根据当前元素找到多维菜单列表中对应的节点
             * 2. 根据当前节点所在的维度列表，找到对应的元素
             */
            case EVENT_CODE.UP: {
                if (!isValidKeyDown()) {
                    return;
                }
                focusNodeElem(getNodeSibling(target, -1, menus.value));
                break;
            }
            case EVENT_CODE.DOWN: {
                if (!isValidKeyDown()) {
                    return;
                }
                focusNodeElem(getNodeSibling(target, 1, menus.value));
                break;
            }
            case EVENT_CODE.LEFT: {
                if (!isValidKeyDown()) {
                    return;
                }
                const menuNode = getMenuNodeByElem(target, menus.value);
                focusNodeElem(menuNode?.parent);
                break;
            }
            case EVENT_CODE.RIGHT: {
                if (!isValidKeyDown()) {
                    return;
                }
                const nextMenu =
                    menus.value[getMenuIndexByElem(target, menus.value) + 1];
                focusNodeElem(nextMenu?.nodes?.[0]);
                break;
            }
            case EVENT_CODE.ENTER: {
                if (!isValidKeyDown()) {
                    return;
                }
                const menuNode = getMenuNodeByElem(target, menus.value);
                checkNodeElem(menuNode);
                break;
            }
            case EVENT_CODE.ESC: {
                emit('close');
                break;
            }
            case EVENT_CODE.TAB: {
                emit('close');
                break;
            }
            default:
                break;
        }
    };

    return {
        handleKeyDown,
    };
}

function useLoadNode(
    props: CascaderPanelProps,
    appendNodes: (
        nodeDataList: CascaderOption[],
        parentNode?: CascaderNode,
    ) => void,
) {
    const handleLoadNode = async (node: CascaderNode) => {
        const { loadData } = props;
        if (!isFunction(loadData)) {
            throw new Error('remote 模式下，loadData 不可为空');
        }

        node.loading = true;
        const childrenData = await loadData(cloneDeep(node.data));
        node.loading = false;
        node.loaded = true;

        // 挂载子节点列表
        if (isArray(childrenData)) {
            appendNodes(childrenData as CascaderOption[], node);
        } else {
            console.error(
                '返回子节点数据格式异常 || childrenData:',
                childrenData,
            );
        }
    };

    return {
        handleLoadNode,
    };
}

export default (
    config: Ref<CascaderNodeConfig>,
    props: CascaderPanelProps,
    emit: CascaderPanelEmits,
) => {
    const {
        menus,
        allNodes,
        leafNodes,
        setNodeElem,
        selectedNodes,
        updateMenus,
        appendNodes,
    } = useNode(config, props);

    useUpdateNodes(props, emit, selectedNodes, allNodes);

    const { handleExpandNode, expandingNode } = useExpandNode(
        menus,
        emit,
        updateMenus,
    );

    const { handleCheckChange } = useCheckChange(
        config,
        props,
        emit,
        selectedNodes,
        leafNodes,
        allNodes,
    );

    const { handleKeyDown } = useKeyDown(config, emit, menus);

    const { handleLoadNode } = useLoadNode(props, appendNodes);

    return {
        menus,
        setNodeElem,
        expandingNode,
        handleExpandNode,
        handleCheckChange,
        handleKeyDown,
        handleLoadNode,
    };
};
