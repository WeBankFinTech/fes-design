import { isArray } from 'lodash-es';

import type { CascaderNodeList, CascaderNodeKey } from '../cascader/interface';
import { CascaderProps } from '../cascader/props';

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
