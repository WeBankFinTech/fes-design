import {
    defineComponent,
    provide,
    onMounted,
    watch,
    ref,
    VNodeChild,
} from 'vue';
import { isFunction, isString, cloneDeep, debounce } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import VirtualList from '../virtual-list/virtualList';
import TreeNode from './treeNode';
import { COMPONENT_NAME, CHECK_STRATEGY } from './const';
import useData from './useData';
import useState from './useState';
import useDrag from './useDrag';
import useFilter from './useFilter';

import { treeProps, TREE_PROVIDE_KEY } from './props';

import type { InnerTreeOption, TreeNodeKey } from './interface';

const prefixCls = getPrefixCls('tree');

export default defineComponent({
    name: COMPONENT_NAME.TREE,
    props: {
        ...treeProps,
    },
    emits: [
        'update:expandedKeys',
        'update:checkedKeys',
        'update:selectedKeys',
        'update:nodeList',
        'check',
        'expand',
        'load',
        'select',
        'dragstart',
        'dragenter',
        'dragover',
        'dragleave',
        'dragend',
        'drop',
    ],
    setup(props, { emit, expose }) {
        useTheme();

        const {
            currentExpandedKeys,
            updateExpandedKeys,
            currentCheckedKeys,
            updateCheckedKeys,
            currentSelectedKeys,
            updateSelectedKeys,
            hasSelected,
        } = useState(props, { emit });

        const { nodeList, transformData } = useData({
            props,
        });

        const { filter, filteredExpandedKeys, filteredKeys, isSearchingRef } =
            useFilter(props, transformData, nodeList);

        watch(
            transformData,
            () => {
                emit('update:nodeList', nodeList);
            },
            {
                immediate: true,
            },
        );

        let checkingNode: InnerTreeOption;

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

        watch(currentCheckedKeys, (newKeys, oldKeys) => {
            // 重置历史节点选择状态
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
                if (checkingNode) {
                    const { indexPath } = checkingNode;
                    indexPath.slice(0).reverse().forEach(computeIndeterminate);
                    checkingNode.hasChildren &&
                        checkingNode.childrenPath.forEach(
                            (key: TreeNodeKey) => {
                                const node = nodeList.get(key);
                                node.isIndeterminate.value = false;
                            },
                        );
                    checkingNode = null;
                } else {
                    transformData.value.forEach(computeIndeterminate);
                }
            }
        });

        const currentData = ref<TreeNodeKey[]>([]);

        let expandingNode: InnerTreeOption;

        const addNode = (nodes: InnerTreeOption[], index: number) => {
            nodes.forEach((node, _index) => {
                currentData.value.splice(_index + index, 0, node.value);
                if (node.isExpanded.value) {
                    node.hasChildren &&
                        addNode(node.children, _index + index + 1);
                }
            });
        };

        const deleteNode = (keys: TreeNodeKey[], index: number) => {
            keys.forEach((key) => {
                if (key === currentData.value[index]) {
                    currentData.value.splice(index, 1);
                }
            });
        };

        const computeCurrentData = () => {
            const res: TreeNodeKey[] = [];
            const expandedKeys = isSearchingRef.value
                ? filteredExpandedKeys.value
                : currentExpandedKeys.value;

            const keys = isSearchingRef.value
                ? filteredKeys.value
                : transformData.value;

            if (expandingNode) {
                // 展开后
                if (expandingNode.isExpanded.value) {
                    const index = currentData.value.indexOf(
                        expandingNode.value,
                    );
                    addNode(expandingNode.children, index + 1);
                } else {
                    const index = currentData.value.indexOf(
                        expandingNode.value,
                    );
                    deleteNode(expandingNode.childrenPath, index + 1);
                }
                return;
            }

            // 缓存每个节点的展开状态，性能更优
            keys.forEach((key) => {
                const node = nodeList.get(key);
                if (node.hasChildren) {
                    node.isExpanded.value = expandedKeys.includes(key);
                }
                const indexPath = node.indexPath;
                const len = indexPath.length;
                let index = 0;
                let parentExpanded = true;
                while (index < len - 1) {
                    const parentNode = nodeList.get(indexPath[index]);
                    if (!parentNode.isExpanded.value) {
                        parentExpanded = false;
                        break;
                    }
                    index += 1;
                }
                if (parentExpanded) {
                    res.push(key);
                }
            });
            currentData.value = res;
        };

        watch(
            [filteredExpandedKeys, filteredKeys],
            debounce(() => {
                if (!isSearchingRef.value) return;
                computeCurrentData();
            }, 10),
        );

        watch(
            [currentExpandedKeys, transformData],
            debounce(() => {
                if (isSearchingRef.value) return;
                computeCurrentData();
            }, 10),
            {
                immediate: true,
            },
        );

        watch([isSearchingRef], () => {
            computeCurrentData();
        });

        const expandNode = (val: TreeNodeKey, event: Event) => {
            const node = nodeList.get(val);
            expandingNode = node;
            if (isSearchingRef.value) {
                const _value = cloneDeep(filteredExpandedKeys.value);
                const index = _value.indexOf(val);
                // 已经展开
                if (index !== -1) {
                    _value.splice(index, 1);
                    // 让动画早点动起来
                    node.isExpanded.value = false;
                } else {
                    _value.push(val);
                    // 让动画早点动起来
                    node.isExpanded.value = true;
                }
                filteredExpandedKeys.value = _value;
                return;
            }

            let values: TreeNodeKey[] = cloneDeep(currentExpandedKeys.value);
            const index = values.indexOf(val);
            // 已经展开
            if (index !== -1) {
                values.splice(index, 1);
                // 让动画早点动起来
                node.isExpanded.value = false;
            } else {
                if (props.accordion) {
                    values = values.filter((item) =>
                        node.indexPath.includes(item),
                    );
                }
                values.push(val);
                // 让动画早点动起来
                node.isExpanded.value = true;
            }
            updateExpandedKeys(values);
            emit('expand', {
                expandedKeys: values,
                event,
                node,
                expanded: values.includes(val),
            });
        };

        const {
            handleDragstart,
            handleDragenter,
            handleDragover,
            handleDragleave,
            handleDragend,
            handleDrop,
            dragOverInfo,
        } = useDrag({ nodeList, emit, expandNode });

        onMounted(() => {
            if (
                props.defaultExpandAll &&
                currentExpandedKeys.value.length === 0
            ) {
                updateExpandedKeys(
                    transformData.value.filter(
                        (value) => !nodeList.get(value).isLeaf,
                    ),
                );
            }
        });

        const selectNode = (val: TreeNodeKey, event: Event) => {
            if (!props.selectable) {
                return;
            }
            const node = nodeList.get(val);
            const values = cloneDeep(currentSelectedKeys.value);
            const index = values.indexOf(val);
            if (props.multiple) {
                if (index !== -1) {
                    props.cancelable && values.splice(index, 1);
                } else {
                    values.push(val);
                }
            } else if (index !== -1) {
                props.cancelable && values.splice(index, 1);
            } else {
                values[0] = val;
            }
            updateSelectedKeys(values);
            emit('select', {
                selectedKeys: values,
                event,
                node,
                selected: values.includes(val),
            });
        };

        function getCheckedKeys(arr: TreeNodeKey[]) {
            return props.cascade
                ? arr.filter((key) => {
                      const node = nodeList.get(key);
                      if (props.checkStrictly === CHECK_STRATEGY.ALL) {
                          return true;
                      }
                      if (props.checkStrictly === CHECK_STRATEGY.PARENT) {
                          return (
                              node.indexPath.filter((path) =>
                                  arr.includes(path),
                              ).length === 1
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
                    if (
                        parent.children.every((item) =>
                            arr.includes(item.value),
                        )
                    ) {
                        arr.push(parent.value);
                    }
                }
            }
        }
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
            checkingNode = node;
            updateCheckedKeys(values);
            emit('check', {
                checkedKeys: getCheckedKeys(values),
                event,
                node,
                checked: values.includes(val),
            });
        };

        if (expose) {
            expose({
                selectNode,
                expandNode,
                checkNode,
                filter,
            });
        }

        provide(TREE_PROVIDE_KEY, {
            props,
            selectNode,
            expandNode,
            checkNode,
            hasSelected,
            nodeList,
            handleDragstart,
            handleDragenter,
            handleDragover,
            handleDragleave,
            handleDragend,
            handleDrop,
            dragOverInfo,
        });

        const renderNode = (value: TreeNodeKey) => {
            const node = nodeList.get(value);
            const itemSlots: {
                [key: string]: () => VNodeChild | string;
            } = {};
            if (isFunction(node.prefix)) {
                itemSlots.prefix = node.prefix;
            }
            if (isString(node.prefix)) {
                itemSlots.prefix = () => node.prefix as string;
            }
            if (isFunction(node.suffix)) {
                itemSlots.suffix = node.suffix;
            }
            if (isString(node.suffix)) {
                itemSlots.suffix = () => node.suffix as string;
            }
            return (
                <TreeNode
                    key={node.uid}
                    level={node.level}
                    value={node.value}
                    label={node.label}
                    disabled={node.disabled}
                    selectable={node.selectable}
                    checkable={node.checkable}
                    isLeaf={node.isLeaf}
                    v-slots={itemSlots}
                    draggable={
                        props.draggable && !props.inline && !node.disabled
                    }
                ></TreeNode>
            );
        };

        const renderChildren = (arr: TreeNodeKey[]) =>
            arr.map((value) => renderNode(value));

        const renderDefault = ({ source }: { source: TreeNodeKey }) =>
            renderNode(source);

        return () =>
            props.virtualList && !props.inline ? (
                <VirtualList
                    dataSources={currentData.value}
                    dataKey={(source: TreeNodeKey) => {
                        return source;
                    }}
                    estimateSize={32}
                    keeps={14}
                    observeResize={false}
                    class={prefixCls}
                    v-slots={{ default: renderDefault }}
                />
            ) : (
                <div class={prefixCls} role="tree">
                    {renderChildren(currentData.value)}
                </div>
            );
    },
});
