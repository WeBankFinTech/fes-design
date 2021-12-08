import getPrefixCls from '../_util/getPrefixCls';

/**
* Generate unique ID
* Maybe replace with [uuid](https://www.npmjs.com/package/uuid)
*/
export const generateId = () => `${Math.random().toString(16).substr(2).toUpperCase()}`;

export const calculatePathNodes = (node) => {
    const nodes = [node];
    let { parent } = node;

    while (parent) {
        nodes.unshift(parent);
        parent = parent.parent;
    }

    return nodes;
};

export const flatNodes = (nodes = [], leafOnly = false) => nodes.reduce((res, node) => {
    if (node.isLeaf) {
        res.push(node);
    } else {
        !leafOnly && res.push(node);
        res = res.concat(flatNodes(node.children, leafOnly));
    }
    return res;
}, []);

/**
 * 多选的时候，更新选中节点的父级节点的选中和半选中状态
 * 1. 遍历选中节点，level从下到上更新父节点的选中状态
 */
export const updateParentNodesCheckState = (selectedNodes = []) => {
    selectedNodes.forEach((node) => {
        const parentNodes = node.pathNodes.slice(0, node.pathNodes.length - 1);
        for (let i = parentNodes.length - 1; i >= 0; i--) {
            const parentNode = parentNodes[i];
            const totalNum = parentNode.children.length;
            const checkedNum = parentNode.children.reduce((res, curr) => {
                const num = curr.checked ? 1 : curr.indeterminate ? 0.5 : 0;
                return res + num;
            }, 0);

            parentNode.checked = parentNode.children.every(child => child.checked);
            parentNode.indeterminate = checkedNum !== totalNum && checkedNum > 0;
        }
    });
};

export const getNode = (data = [], config = {}, parent = null) => {
    const node = {};

    const {
        valueField, labelField, childrenField, disabledField,
    } = config || {};

    node.checked = false;
    node.indeterminate = false;

    node.data = data || [];
    node.parent = parent;

    const childrenData = data[childrenField];
    const pathNodes = calculatePathNodes(node);

    node.nodeId = generateId();
    node.level = parent ? parent.level + 1 : 1;
    node.value = data[valueField];
    node.label = data[labelField];
    node.pathNodes = pathNodes;
    node.pathValues = pathNodes.map(item => item.value);
    node.pathLabels = pathNodes.map(item => item.label);

    node.childrenData = childrenData;
    node.children = (childrenData || []).map(
        child => getNode(child, config, node),
    );
    node.isDisabled = !!data[disabledField] || !!parent?.data[disabledField];
    node.isLeaf = node.children.length < 1;

    node.elem = null;

    return node;
};

export const getNodeByValue = (nodes, value) => {
    const filterNodes = flatNodes(nodes).filter(
        node => node.value === value,
    );

    return filterNodes[0] || null;
};

export const getValueByOption = (config, node) => (config.emitPath ? node.pathValues : node.value);

// 获取单节点值
export const getNodeValueByCurrentValue = (emitPath, value) => {
    let nodeValue = '';
    if (emitPath) {
        if (Array.isArray(value)) {
            nodeValue = value[value.length - 1];
        } else {
            console.warn('value类型不符预期，emitPath为true的情况下，value应该为数组格式');
        }
    } else {
        nodeValue = value;
    }
    return nodeValue;
};

// 获取多节点值列表
export const getMultiNodeValuesByCurrentValue = (emitPath, currentValue) => {
    const nodeValues = [];
    if (!Array.isArray(currentValue)) {
        console.warn('currentValue类型不符预期，multiple为true的情况下，currentValue应该为数组格式');
    } else {
        currentValue.forEach((value) => {
            const nodeValue = getNodeValueByCurrentValue(emitPath, value);
            if (nodeValue) {
                nodeValues.push(nodeValue);
            }
        });
    }
    return nodeValues;
};

export const getMenuIndexByElem = (el, menus) => menus.findIndex(menu => menu.find(node => node.elem === el));
export const getMenuNodeByElem = (el, menus) => {
    const currentMenu = menus[getMenuIndexByElem(el, menus)] || null;
    return currentMenu?.find(node => node.elem === el) || null;
};

// 获取元素兄弟节点
export const getNodeSibling = (el, distance = 0, menus) => {
    if (!el || !menus.length) return;
    let siblingNode = null;
    let currentNodeIndex = -1;

    const currentMenu = menus[getMenuIndexByElem(el, menus)] || null;
    currentNodeIndex = currentMenu?.findIndex(node => node.elem === el);
    siblingNode = currentNodeIndex > -1 ? currentMenu?.[currentNodeIndex + distance] || null : null;

    while (siblingNode && siblingNode.isDisabled) {
        const currentElem = siblingNode.elem;
        currentNodeIndex = currentMenu.findIndex(node => node.elem === currentElem);
        siblingNode = currentNodeIndex > -1 ? currentMenu[currentNodeIndex + (distance > 0 ? 1 : -1)] || null : null;
    }

    return siblingNode;
};

// 让元素获取焦点，同时若为非叶子节点，则展开下一级
export const focusNodeElem = (node) => {
    if (!node || !node.elem) return;
    node.elem.focus();
    !node.isLeaf && node.elem.click();
};

export const checkNodeElem = (node) => {
    if (!node || !node.elem) return;
    const input = node.elem.querySelector(`.${getPrefixCls('checkbox')}`);
    if (input) {
        input.click();
    } else if (node.isLeaf) {
        node.elem.click();
    }
};
