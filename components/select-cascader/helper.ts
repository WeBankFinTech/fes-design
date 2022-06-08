import { isArray } from 'lodash-es';

import type {
    CascaderNodeList,
    CascaderNodeKey,
    CascaderOption,
} from '../cascader/interface';
import type { CascaderProps } from '../cascader/props';

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

export const getNotMatchedPathByKey = (
    currentValue: CascaderNodeKey | CascaderNodeKey[] | CascaderNodeKey[][],
    props: CascaderProps,
    key: CascaderNodeKey,
) => {
    let path: CascaderOption[] = [];
    if (currentValue === null) {
        return path;
    }
    if (props.multiple) {
        const keyIndex = (
            currentValue as CascaderNodeKey[] | CascaderNodeKey[][]
        ).findIndex((value) => {
            if (props.emitPath && isArray(value)) {
                return value.includes(key);
            } else {
                return value === key;
            }
        });
        if (keyIndex > -1) {
            const keyValue = (
                currentValue as CascaderNodeKey[] | CascaderNodeKey[][]
            )[keyIndex];

            if (props.emitPath && isArray(keyValue)) {
                path = (keyValue as CascaderNodeKey[]).map((value) => {
                    return {
                        value,
                        label: value as string,
                    };
                });
            } else {
                path = [
                    {
                        value: keyValue as CascaderNodeKey,
                        label: keyValue as string,
                    },
                ];
            }
        }
    } else {
        if (props.emitPath && isArray(currentValue)) {
            if ((currentValue as CascaderNodeKey[]).includes(key)) {
                path = (currentValue as CascaderNodeKey[]).map((value) => {
                    return {
                        value,
                        label: value as string,
                    };
                });
            }
        } else {
            if (key === currentValue) {
                path = [
                    {
                        value: currentValue as CascaderNodeKey,
                        label: currentValue as string,
                    },
                ];
            }
        }
    }

    return path;
};

export const getExpandedKeysBySelectedKeys = (
    nodeList: CascaderNodeList,
    selectedKeys: CascaderNodeKey[] = [],
) => {
    const selectedNode = (selectedKeys[0] && nodeList[selectedKeys[0]]) || null;
    if (selectedNode) {
        // 叶子节点也包含在内，以便操作反馈
        return [...selectedNode.indexPath];
    } else {
        return [];
    }
};
