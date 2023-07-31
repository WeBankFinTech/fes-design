import { Ref, shallowRef, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { CHECK_STRATEGY } from './const';
import { getChildrenByValues, getParentByValues } from './helper';
import type { TreeNodeKey, InnerTreeOption } from './interface';
import type { TreeProps } from './props';

export default ({
    allKeys,
    nodeList,
    currentCheckedKeys,
    updateCheckedKeys,
    props,
    emit,
}: {
    allKeys: Ref<TreeNodeKey[]>;
    nodeList: Map<TreeNodeKey, InnerTreeOption>;
    currentCheckedKeys: Ref<TreeNodeKey[]>;
    updateCheckedKeys: (keys: TreeNodeKey[]) => void;
    props: TreeProps;
    emit: any;
}) => {
    function computeIndeterminate(node: InnerTreeOption) {
        if (node.hasChildren) {
            if (node.isChecked.value) {
                node.isIndeterminate.value = false;
            } else {
                node.isIndeterminate.value = node.children.some(
                    (item) =>
                        item.isChecked.value || item.isIndeterminate.value,
                );
            }
        } else {
            node.isIndeterminate.value = false;
        }
    }

    function init() {
        if (props.checkable) {
            if (!props.cascade) {
                return currentCheckedKeys.value;
            }
            if (props.checkStrictly === CHECK_STRATEGY.ALL) {
                return currentCheckedKeys.value;
            }
            if (props.checkStrictly === CHECK_STRATEGY.PARENT) {
                return getChildrenByValues(nodeList, currentCheckedKeys.value);
            }
            if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                return getParentByValues(nodeList, currentCheckedKeys.value);
            }
            return currentCheckedKeys.value;
        }
        return [];
    }

    const _keys: Ref<TreeNodeKey[]> = shallowRef([]);

    let unwatch = false;

    let unwatchCurrent = false;

    watch(
        [currentCheckedKeys, allKeys],
        () => {
            if (!props.checkable) return;
            if (unwatchCurrent) {
                unwatchCurrent = false;
                return;
            }
            _keys.value = init();
        },
        {
            immediate: true,
            deep: true,
        },
    );

    watch(
        _keys,
        (newKeys, oldKeys) => {
            if (!props.checkable) return;
            if (unwatch) {
                unwatch = false;
                return;
            }
            // 重置历史节点选择状态
            if (Array.isArray(oldKeys)) {
                oldKeys.forEach((key: TreeNodeKey) => {
                    const node = nodeList.get(key);
                    node.isChecked.value = false;
                });
            }
            newKeys.forEach((key: TreeNodeKey) => {
                const node = nodeList.get(key);
                node.isChecked.value = true;
            });
            if (props.cascade) {
                allKeys.value
                    .slice(0)
                    .reverse()
                    .forEach((key) => {
                        const node = nodeList.get(key);
                        computeIndeterminate(node);
                    });
            }
        },
        {
            immediate: true,
        },
    );

    const computeCheckedKeys = (
        _values: TreeNodeKey[],
        node: InnerTreeOption,
    ) => {
        const { hasChildren, childrenPath, indexPath, isChecked, value } = node;
        if (isChecked.value) {
            if (hasChildren) {
                childrenPath.forEach((key) => {
                    const childNode = nodeList.get(key);
                    if (childNode.isChecked.value) {
                        childNode.isChecked.value = false;
                        const index = _values.indexOf(childNode.value);
                        _values.splice(index, 1);
                    }
                    childNode.isIndeterminate.value = false;
                });
            }
            let len = indexPath.length - 1;
            for (len; len >= 0; len--) {
                const parentNode = nodeList.get(indexPath[len]);
                if (parentNode.isChecked.value) {
                    parentNode.isChecked.value = false;
                    const index = _values.indexOf(parentNode.value);
                    _values.splice(index, 1);
                }
                computeIndeterminate(parentNode);
            }
        } else {
            if (hasChildren) {
                childrenPath.forEach((key) => {
                    const childNode = nodeList.get(key);
                    if (!childNode.isChecked.value) {
                        childNode.isChecked.value = true;
                        _values.push(childNode.value);
                    }
                    childNode.isIndeterminate.value = false;
                });
            }

            // 选中
            _values.push(value);

            node.isChecked.value = true;

            computeIndeterminate(node);

            let len = indexPath.length - 2;
            for (len; len >= 0; len--) {
                const parentNode = nodeList.get(indexPath[len]);
                if (
                    parentNode.children.every(
                        (childNode) => childNode.isChecked.value,
                    )
                ) {
                    parentNode.isChecked.value = true;
                    _values.push(parentNode.value);
                }
                computeIndeterminate(parentNode);
            }
        }
    };

    const checkNode = (val: TreeNodeKey, event: Event) => {
        const node = nodeList.get(val);
        unwatch = true;
        unwatchCurrent = true;

        const _values = cloneDeep(_keys.value);
        let values;

        if (!props.cascade) {
            // 非关联
            const index = _values.indexOf(val);
            if (node.isChecked.value) {
                _values.splice(index, 1);
            } else {
                _values.push(val);
            }
            node.isChecked.value = !node.isChecked.value;
            values = _values;
        } else {
            if (props.checkStrictly === CHECK_STRATEGY.ALL) {
                computeCheckedKeys(_values, node);
                values = _values;
            } else if (props.checkStrictly === CHECK_STRATEGY.PARENT) {
                computeCheckedKeys(_values, node);
                values = _values.filter((key) => {
                    const node = nodeList.get(key);
                    return (
                        node.indexPath.filter((path) => {
                            const parenNode = nodeList.get(path);
                            return parenNode.isChecked.value;
                        }).length === 1
                    );
                });
            } else if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                computeCheckedKeys(_values, node);
                values = _values.filter((key) => {
                    const node = nodeList.get(key);
                    return node.isLeaf;
                });
            } else {
                computeCheckedKeys(_values, node);
                values = _values;
            }
        }

        _keys.value = _values;
        updateCheckedKeys(values);

        emit('check', {
            checkedKeys: values,
            event,
            node,
            checked: node.isChecked.value,
        });
    };

    return {
        checkNode,
    };
};
