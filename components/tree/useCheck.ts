import { Ref, shallowRef, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { TreeNodeKey, InnerTreeOption } from './interface';
import type { TreeProps } from './props';
import { CHECK_STRATEGY } from './const';

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
    function getCheckedKeys(arr: TreeNodeKey[]) {
        return props.cascade
            ? arr.filter((key) => {
                  const node = nodeList.get(key);
                  if (props.checkStrictly === CHECK_STRATEGY.ALL) {
                      return true;
                  }
                  if (props.checkStrictly === CHECK_STRATEGY.PARENT) {
                      return (
                          node.indexPath.filter((path) => arr.includes(path))
                              .length === 1
                      );
                  }
                  if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                      return node.isLeaf;
                  }
                  return true;
              })
            : arr;
    }

    function handleChildren(
        arr: TreeNodeKey[],
        children: InnerTreeOption[],
        isAdd: boolean,
    ) {
        children &&
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

    function handleParent(
        arr: TreeNodeKey[],
        indexPath: TreeNodeKey[],
        isAdd: boolean,
    ) {
        let len = indexPath.length - 2;
        for (len; len >= 0; len--) {
            const parent = nodeList.get(indexPath[len]);
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

    function computeIndeterminate(key: TreeNodeKey) {
        const node = nodeList.get(key);
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

    const checkingNode: Ref<InnerTreeOption | null> = shallowRef(null);

    watch(
        currentCheckedKeys,
        (newKeys, oldKeys) => {
            // 重置历史节点选择状态
            Array.isArray(oldKeys) &&
                oldKeys.forEach((key: TreeNodeKey) => {
                    const node = nodeList.get(key);
                    node.isChecked.value = false;
                });
            newKeys.forEach((key: TreeNodeKey) => {
                const node = nodeList.get(key);
                node.isChecked.value = true;
            });
            if (props.cascade) {
                // 当选中某个节点时，只需要处理此节点相关上下节点状态
                if (checkingNode.value) {
                    const node = checkingNode.value;
                    const { indexPath } = node;
                    indexPath.slice(0).reverse().forEach(computeIndeterminate);
                    node.hasChildren &&
                        node.childrenPath.forEach((key: TreeNodeKey) => {
                            const node = nodeList.get(key);
                            node.isIndeterminate.value = false;
                        });
                    checkingNode.value = null;
                } else {
                    allKeys.value.forEach(computeIndeterminate);
                }
            }
        },
        {
            immediate: true,
        },
    );

    const checkNode = (val: TreeNodeKey, event: Event) => {
        const node = nodeList.get(val);
        const { isLeaf, children, indexPath } = node;
        const values = cloneDeep(currentCheckedKeys.value);
        const index = values.indexOf(val);
        if (!props.cascade) {
            if (index !== -1) {
                values.splice(index, 1);
            } else {
                values.push(val);
            }
        } else if (index !== -1) {
            values.splice(index, 1);
            handleParent(values, indexPath, false);
            if (!isLeaf) {
                handleChildren(values, children, false);
            }
        } else {
            values.push(val);
            handleParent(values, indexPath, true);
            if (!isLeaf) {
                handleChildren(values, children, true);
            }
        }
        checkingNode.value = node;
        updateCheckedKeys(values);
        emit('check', {
            checkedKeys: getCheckedKeys(values),
            event,
            node,
            checked: values.includes(val),
        });
    };

    return {
        checkingNode,
        checkNode,
    };
};
