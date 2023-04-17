import { isArray } from 'lodash-es';

import type {
    CascaderNodeList,
    CascaderNodeKey,
    InnerCascaderOption,
} from './interface';

// 根据父节点获取关联选中的子节点
export const getCascadeChildrenByKeys = (
    nodeList: CascaderNodeList,
    keys: CascaderNodeKey[] = [],
) => {
    let arr = [...keys];
    keys.forEach((value) => {
        const node = nodeList[value];
        // 兼容异步加载，未匹配到节点的情况
        if (node && isArray(node.children)) {
            arr = arr.concat(
                getCascadeChildrenByKeys(
                    nodeList,
                    node.children.map((child) => child.value),
                ),
            );
        }
    });
    return arr;
};

// 根据子节点获取关联选中的父节点
export const getCascadeParentByKeys = (
    nodeList: CascaderNodeList,
    keys: CascaderNodeKey[] = [],
) => {
    const res: Record<string, CascaderNodeKey[]> = {};
    keys.forEach((value) => {
        const node = nodeList[value];
        // 兼容异步加载，未匹配到节点的情况
        if (node) {
            if (!res[node.level]) {
                res[node.level] = [];
            }
            res[node.level].push(node.value);
        }
    });
    const levels = Object.keys(res).map((key) => Number(key));
    const maxLevel = levels[levels.length - 1];
    for (let level = maxLevel; level > 0; level--) {
        const levelValues = res[level];
        if (levelValues) {
            levelValues.forEach((value) => {
                const node = nodeList[value];
                const parentValue = node.indexPath[node.indexPath.length - 2];
                if (parentValue) {
                    const parentNode = nodeList[parentValue];
                    if (
                        parentNode.children.every((child) =>
                            levelValues.includes(child.value),
                        )
                    ) {
                        if (!res[level - 1]) {
                            res[level - 1] = [];
                        }
                        if (!res[level - 1].includes(parentValue)) {
                            res[level - 1].push(parentValue);
                        }
                    }
                }
            });
        }
    }
    let arr: CascaderNodeKey[] = [];
    Object.values(res).forEach((levelValues) => {
        arr = arr.concat(levelValues);
    });
    return arr;
};

// 子节点关联项的选中和取消选中
export function handleChildren(
    arr: CascaderNodeKey[],
    children: InnerCascaderOption[],
    isAdd: boolean,
) {
    if (children) {
        children.forEach((child) => {
            const index = arr.indexOf(child.value);
            if (!isAdd) {
                if (index !== -1) {
                    arr.splice(index, 1);
                }
            } else if (index === -1) {
                arr.push(child.value);
            }
            if (child.children) {
                handleChildren(arr, child.children, isAdd);
            }
        });
    }
}

// 父节点关联项的选中和取消选中
export function handleParent(
    arr: CascaderNodeKey[],
    indexPath: CascaderNodeKey[],
    isAdd: boolean,
    nodeList: CascaderNodeList,
) {
    let len = indexPath.length - 2;
    for (len; len >= 0; len--) {
        const parent = nodeList[indexPath[len]];
        const index = arr.indexOf(parent.value);
        if (!isAdd) {
            if (index !== -1) {
                arr.splice(index, 1);
            }
        } else if (index === -1) {
            if (parent.children.every((item) => arr.includes(item.value))) {
                arr.push(parent.value);
            }
        }
    }
}

export function scrollIntoParentView(
    element: HTMLElement,
    parent?: HTMLElement,
) {
    parent = parent || element.parentElement;
    if (!parent) {
        return;
    }

    // offsetParent may not be parent.
    const elementToParent = element.offsetTop - parent.offsetTop;

    if (elementToParent - parent.scrollTop < 0) {
        parent.scrollTo({ top: elementToParent });
    } else if (
        elementToParent + element.offsetHeight - parent.scrollTop >
        parent.offsetHeight
    ) {
        parent.scrollTo({
            top: elementToParent + element.offsetHeight - parent.offsetHeight,
        });
    }
}
