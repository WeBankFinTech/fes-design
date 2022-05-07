import { isArray } from 'lodash-es';

import type { CascaderNodeList, CascaderNodeKey } from '../cascader/interface';
import { CascaderProps } from '../cascader/props';

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
        if (!res[node.level]) {
            res[node.level] = [];
        }
        res[node.level].push(node.value);
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

export const getCurrentValueByKeys = (
    nodeList: CascaderNodeList,
    keys: CascaderNodeKey[] = [],
    props: CascaderProps,
) => {
    const value: null | [] = props.multiple || props.emitPath ? [] : null;

    if (!keys.length) {
        return value;
    }
    if (props.multiple) {
        const nodeValues = Object.keys(nodeList);
        // 兼容异步加载，未匹配到节点的情况
        const notMatchedKeys = keys.filter(
            (key) => !(nodeValues as CascaderNodeKey[]).includes(key),
        );
        // 保持层级顺序不变
        return [].concat(
            notMatchedKeys,
            nodeValues
                .filter((key) => keys.includes(key))
                .map((key) =>
                    props.emitPath ? [...nodeList[key].indexPath] : key,
                ),
        );
    } else {
        return props.emitPath ? [...nodeList[keys[0]].indexPath] : keys[0];
    }
};

export const getKeysByCurrentValue = (
    currentValue: CascaderNodeKey | CascaderNodeKey[] | CascaderNodeKey[][],
    props: CascaderProps,
) => {
    const keys: CascaderNodeKey[] = [];
    if (currentValue === null) {
        return keys;
    }
    if (props.multiple) {
        return (currentValue as CascaderNodeKey[] | CascaderNodeKey[][]).map(
            (value) => {
                if (props.emitPath && isArray(value)) {
                    return value[value.length - 1];
                } else {
                    return value;
                }
            },
        );
    } else {
        if (props.emitPath && isArray(currentValue)) {
            return currentValue.slice(currentValue.length - 1);
        } else {
            return [currentValue];
        }
    }
};
