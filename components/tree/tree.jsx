import { defineComponent, provide, onMounted } from 'vue';
import { isFunction, isString, cloneDeep } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import VirtualList from '../virtual-list';
import TreeNode from './treeNode';
import { PROVIDE_KEY, COMPONENT_NAME, CHECK_STRATEGY } from './const';
import useData from './useData';
import useState from './useState';
import PROPS from './props';

const prefixCls = getPrefixCls('tree');

export default defineComponent({
    name: COMPONENT_NAME.TREE,
    props: {
        ...PROPS,
    },
    emits: [
        'update:expandedKeys',
        'update:checkedKeys',
        'update:selectedKeys',
        'check',
        'expand',
        'load',
        'select',
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
            filter,
            hiddenKeys,
            filteredExpandedKeys,
            hasSelected,
            hasChecked,
            hasIndeterminate,
            hasExpanded,
        } = useState(props, { emit });

        const { nodeList, currentData } = useData({
            props,
            hiddenKeys,
            hasExpanded,
            filteredExpandedKeys,
            currentExpandedKeys,
        });

        onMounted(() => {
            if (
                props.defaultExpandAll &&
                currentExpandedKeys.value.length === 0
            ) {
                updateExpandedKeys(
                    Object.values(nodeList).map((item) => item.value),
                );
            }
        });

        const selectNode = (val, event) => {
            const node = nodeList[val];
            const values = cloneDeep(currentSelectedKeys.value);
            if (!props.selectable) {
                return;
            }
            const index = values.indexOf(val);
            if (props.multiple) {
                if (index !== -1) {
                    values.splice(index, 1);
                } else {
                    values.push(val);
                }
            } else if (index !== -1) {
                values.splice(index, 1);
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

        const expandNode = (val, event) => {
            const node = nodeList[val];
            let values = cloneDeep(currentExpandedKeys.value);
            const index = values.indexOf(val);
            // 已经展开
            if (index !== -1) {
                values.splice(index, 1);
            } else {
                if (props.accordion) {
                    values = values.filter((item) =>
                        node.indexPath.includes(item),
                    );
                }
                values.push(val);
            }
            updateExpandedKeys(values);
            emit('expand', {
                expandedKeys: values,
                event,
                node,
                expanded: values.includes(val),
            });
        };

        function getCheckedKeys(arr) {
            return props.cascade
                ? arr.filter((key) => {
                      const node = nodeList[key];
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
        function handleChildren(arr, children, isAdd) {
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
        function handleParent(arr, indexPath, isAdd) {
            let len = indexPath.length - 2;
            for (len; len >= 0; len--) {
                const parent = nodeList[indexPath[len]];
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
        const checkNode = (val, event) => {
            const node = nodeList[val];
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

        provide(PROVIDE_KEY, {
            props,
            selectNode,
            expandNode,
            checkNode,
            hasSelected,
            hasChecked,
            hasIndeterminate,
            hasExpanded,
            nodeList,
        });

        const renderNode = (value) => {
            const node = nodeList[value];
            const itemSlots = {};
            if (isFunction(node.prefix)) {
                itemSlots.prefix = node.prefix;
            }
            if (isString(node.prefix)) {
                itemSlots.prefix = () => node.prefix;
            }
            if (isFunction(node.suffix)) {
                itemSlots.suffix = node.suffix;
            }
            if (isString(node.suffix)) {
                itemSlots.suffix = () => node.suffix;
            }
            return (
                <TreeNode
                    key={node.value}
                    level={node.level}
                    value={node.value}
                    label={node.label}
                    disabled={node.disabled}
                    selectable={node.selectable}
                    checkable={node.checkable}
                    isLeaf={node.isLeaf}
                    v-slots={itemSlots}
                ></TreeNode>
            );
        };

        const renderChildren = (arr) => arr.map((value) => renderNode(value));

        const renderDefault = ({ source }) => renderNode(source);

        return () =>
            props.virtualList && !props.inline ? (
                <VirtualList
                    dataSources={currentData.value}
                    dataKey={(source) => source}
                    estimateSize={32}
                    keeps={14}
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
