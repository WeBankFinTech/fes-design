import { isArray } from 'lodash-es';

import type { TreeNodeKey, InnerTreeOption } from '../tree/interface';

export const getChildrenByValues = (
    nodeList: Map<TreeNodeKey, InnerTreeOption>,
    values: TreeNodeKey[] = [],
) => {
    let arr = [...values];
    values.forEach((value) => {
        const node = nodeList.get(value);
        if (isArray(node.children)) {
            arr = arr.concat(node.childrenPath);
        }
    });
    return arr;
};

export const getParentByValues = (
    nodeList: Map<TreeNodeKey, InnerTreeOption>,
    values: TreeNodeKey[] = [],
) => {
    const res: Record<string, TreeNodeKey[]> = {};
    values.forEach((value) => {
        const node = nodeList.get(value);
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
                const node = nodeList.get(value);
                const parentValue = node.indexPath[node.indexPath.length - 2];
                if (parentValue) {
                    const parentNode = nodeList.get(parentValue);
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
    let arr: TreeNodeKey[] = [];
    Object.values(res).forEach((levelValues) => {
        arr = arr.concat(levelValues);
    });
    return arr;
};
