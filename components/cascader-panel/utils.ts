import getPrefixCls from '../_util/getPrefixCls';
import { CHECK_STRATEGY } from './const';

import type {
    CascaderNodeConfig,
    OptionValue,
    CascaderMenu,
} from './interface';
import type { CascaderNode } from './getNode';

import { isArray } from 'lodash-es';

/**
 * Generate unique ID
 * Maybe replace with [uuid](https://www.npmjs.com/package/uuid)
 *
 * 注：为了使得options改变的情况下生成的menuId和nodeId一致，所以这个方法废弃
 */
// export const generateId = () =>
//     `${Math.random().toString(16).slice(2).toUpperCase()}`;

export const calculatePathNodes = (node: CascaderNode) => {
    const nodes = [node];
    let { parent } = node;

    while (parent) {
        nodes.unshift(parent);
        parent = parent.parent;
    }

    return nodes;
};

/**
 * 多选的时候，更新选中节点的父级节点的选中和半选中状态
 * 1. 遍历选中节点，level 从下到上更新父节点的选中状态
 */
export const updateParentNodesCheckState = (
    selectedNodes: CascaderNode[] = [],
) => {
    selectedNodes.forEach((node) => {
        const parentNodes = node.pathNodes.slice(0, node.pathNodes.length - 1);
        for (let i = parentNodes.length - 1; i >= 0; i--) {
            const parentNode = parentNodes[i];
            const totalNum = parentNode.children.length;
            const checkedNum = parentNode.children.reduce((res, curr) => {
                const num = curr.checked ? 1 : curr.indeterminate ? 0.5 : 0;
                return res + num;
            }, 0);

            parentNode.checked = parentNode.children.every(
                (child) => child.checked,
            );
            parentNode.indeterminate =
                checkedNum !== totalNum && checkedNum > 0;
        }
    });
};

/**
 * 多选情况，更新选中节点子级节点的选中状态
 * 1. 遍历选中节点，获取所有的子孙节点，全部置为选中状态
 */
export const updateChildNodesCheckState = (
    selectedNodes: CascaderNode[] = [],
) => {
    selectedNodes.forEach((node) => {
        const childAndLeafNodes = flatNodes(node.children);
        childAndLeafNodes.forEach((item) => {
            item.checked = true;
        });
    });
};

/**
 * 根据叶子节点列表获取包含关联选中父节点的值列表
 * 1. 遍历叶子节点，level 从下到上判断父节点是否选中
 * 2. 若父节点为选中状态（所有子节点值都在值列表中），则值列表中插入父节点
 * 3. 遍历全部节点列表，顺序返回
 * 4. 若为 checkStrictly = parent 情况，则若当前节点的父节点值不在值列表中，则插入当前节点
 */
export const getCheckNodesByLeafCheckNodes = (
    checkLeafNodes: CascaderNode[] = [],
    allNodes: CascaderNode[] = [],
    checkStrictly: CHECK_STRATEGY,
) => {
    const checkNodeValues: OptionValue[] = [];

    checkLeafNodes.forEach((node) => {
        checkNodeValues.push(node.value);

        const parentNodes = node.pathNodes.slice(0, node.pathNodes.length - 1);
        for (let i = parentNodes.length - 1; i >= 0; i--) {
            const parentNode = parentNodes[i];
            const parentChecked = parentNode.children.every((child) =>
                checkNodeValues.includes(child.value),
            );
            if (parentChecked) {
                checkNodeValues.push(parentNode.value);
            }
        }
    });

    return allNodes.filter((item) => {
        if (!checkNodeValues.includes(item.value)) {
            return false;
        }
        if (checkStrictly === CHECK_STRATEGY.PARENT) {
            if (item.parent) {
                return !checkNodeValues.includes(item.parent.value);
            }
        }
        return true;
    });
};

export const getNodeByValue = (allNodes: CascaderNode[], value: OptionValue) =>
    allNodes.find((node) => node.value === value) || null;

export const getValueByOption = (
    config: CascaderNodeConfig,
    node: CascaderNode,
) => (config.emitPath ? node.pathValues : node.value);

export const getNodeValueByCurrentValue = (
    multiple: boolean,
    emitPath: boolean,
    currentValue: OptionValue | OptionValue[],
) => {
    // 单选
    if (!multiple) {
        return getSingleNodeValueByCurrentValue(
            emitPath,
            currentValue as OptionValue,
        );
    } else {
        // 多选
        return getMultiNodeValuesByCurrentValue(
            emitPath,
            currentValue as OptionValue[],
        );
    }
};

// 获取单节点值
export const getSingleNodeValueByCurrentValue = (
    emitPath: boolean,
    value: OptionValue,
) => {
    let nodeValue: OptionValue;
    if (emitPath) {
        if (isArray(value)) {
            nodeValue = (value.length && value[value.length - 1]) || '';
        } else {
            // 若设置的有值，则校验提示
            value &&
                console.warn(
                    'value类型不符预期，emitPath为true的情况下，value应该为数组格式',
                );
        }
    } else {
        nodeValue = value ?? '';
    }
    return nodeValue;
};

// 获取多节点值列表
export const getMultiNodeValuesByCurrentValue = (
    emitPath: boolean,
    currentValue: OptionValue[],
) => {
    const nodeValues: OptionValue[] = [];
    if (!isArray(currentValue)) {
        // 若设置的有值，则校验提示
        currentValue &&
            console.warn(
                'currentValue类型不符预期，multiple为true的情况下，currentValue应该为数组格式',
            );
    } else {
        currentValue.forEach((value) => {
            const nodeValue = getSingleNodeValueByCurrentValue(emitPath, value);
            if (nodeValue) {
                nodeValues.push(nodeValue);
            }
        });
    }
    return nodeValues;
};

export const getMenuIndexByElem = (el: HTMLElement, menus: CascaderMenu[]) =>
    menus.findIndex((menu) => menu.nodes.find((node) => node.elem === el));

export const getMenuNodeByElem = (el: HTMLElement, menus: CascaderMenu[]) => {
    const currentMenu = menus[getMenuIndexByElem(el, menus)] || null;
    return currentMenu?.nodes.find((node) => node.elem === el) || null;
};

// 获取元素兄弟节点
export const getNodeSibling = (
    el: HTMLElement,
    distance = 0,
    menus: CascaderMenu[],
) => {
    if (!el || !menus.length) return;
    let siblingNode = null;
    let currentNodeIndex = -1;

    const currentMenu = menus[getMenuIndexByElem(el, menus)] || null;
    currentNodeIndex = currentMenu?.nodes.findIndex(
        (node: CascaderNode) => node.elem === el,
    );
    siblingNode =
        currentNodeIndex > -1
            ? currentMenu?.nodes[currentNodeIndex + distance] || null
            : null;

    while (siblingNode && siblingNode.isDisabled) {
        const currentElem = siblingNode.elem;
        currentNodeIndex = currentMenu.nodes.findIndex(
            (node: CascaderNode) => node.elem === currentElem,
        );
        siblingNode =
            currentNodeIndex > -1
                ? currentMenu.nodes[
                      currentNodeIndex + (distance > 0 ? 1 : -1)
                  ] || null
                : null;
    }

    return siblingNode;
};

// 让元素获取焦点，同时若为非叶子节点，则展开下一级
export const focusNodeElem = (node: CascaderNode) => {
    if (!node || !node.elem) return;
    node.elem.focus();
    !node.isLeaf && node.elem.click();
};

export const checkNodeElem = (node: CascaderNode) => {
    if (!node || !node.elem) return;
    const input = node.elem.querySelector(`.${getPrefixCls('checkbox')}`);
    if (input) {
        (input as HTMLInputElement).click();
    } else if (node.isLeaf) {
        node.elem.click();
    }
};

export const flatNodes = (nodes: CascaderNode[] = [], leafOnly = false) =>
    nodes.reduce((res: CascaderNode[], node) => {
        if (node.isLeaf) {
            res.push(node);
        } else {
            !leafOnly && res.push(node);
            res = res.concat(flatNodes(node.children, leafOnly));
        }
        return res;
    }, []);
